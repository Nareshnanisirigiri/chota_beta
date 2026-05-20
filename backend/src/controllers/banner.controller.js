const { pool } = require('../config/database');

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const getBanners = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            type, 
            position, 
            visibility_status 
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = [];
        let params = [];

        if (search) {
            whereClauses.push('(b.title LIKE ? OR b.slug LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        if (type) {
            whereClauses.push('b.type = ?');
            params.push(type);
        }

        if (position) {
            whereClauses.push('b.position = ?');
            params.push(position);
        }

        if (visibility_status) {
            whereClauses.push('b.visibility_status = ?');
            params.push(visibility_status);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Query total count
        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM banners b
            ${whereSQL}
        `;
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;

        // Query paginated rows with media and linked details
        const selectQuery = `
            SELECT 
              b.*, 
              m.id as media_id, 
              m.file_name as file_name,
              m.disk as disk,
              p.title as product_title,
              c.title as category_title,
              br.title as brand_title
            FROM banners b
            LEFT JOIN media m ON m.model_id = b.id AND m.model_type = 'App\\\\Models\\\\Banner'
            LEFT JOIN products p ON b.product_id = p.id
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN brands br ON b.brand_id = br.id
            ${whereSQL}
            ORDER BY b.display_order ASC, b.id DESC
            LIMIT ? OFFSET ?
        `;
        
        const queryParams = [...params, parsedLimit, offset];
        const [rows] = await pool.query(selectQuery, queryParams);

        res.json({
            success: true,
            data: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parsedLimit,
                totalPages: Math.ceil(total / parsedLimit)
            }
        });
    } catch (error) {
        console.error('getBanners error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch banners: ' + error.message });
    }
};

const createBanner = async (req, res) => {
    try {
        const { 
            title, 
            type, 
            scope_type, 
            scope_id, 
            custom_url, 
            product_id, 
            category_id, 
            brand_id, 
            position, 
            visibility_status, 
            display_order 
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Banner title is required' });
        }

        const slug = generateSlug(title) + '-' + Math.floor(Math.random() * 1000);
        const uuid = generateUUID();

        const insertBannerQuery = `
            INSERT INTO banners (
              type, scope_type, scope_id, title, slug, custom_url, 
              product_id, category_id, brand_id, position, 
              visibility_status, display_order, metadata, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null, NOW(), NOW())
        `;

        const parsedScopeId = scope_id ? parseInt(scope_id) : null;
        const parsedProductId = product_id ? parseInt(product_id) : null;
        const parsedCategoryId = category_id ? parseInt(category_id) : null;
        const parsedBrandId = brand_id ? parseInt(brand_id) : null;
        const parsedDisplayOrder = display_order ? parseInt(display_order) : 10;

        const [bannerResult] = await pool.query(insertBannerQuery, [
            type || 'custom',
            scope_type || 'global',
            parsedScopeId,
            title,
            slug,
            custom_url || null,
            parsedProductId,
            parsedCategoryId,
            parsedBrandId,
            position || 'top',
            visibility_status || 'published',
            parsedDisplayOrder
        ]);

        const bannerId = bannerResult.insertId;

        // If file exists, insert row in media table
        if (req.files && req.files.image && req.files.image[0]) {
            const file = req.files.image[0];
            const mediaUuid = generateUUID();
            const originalName = file.originalname.split('.').slice(0, -1).join('.') || 'banner';

            const insertMediaQuery = `
                INSERT INTO media (
                  model_type, model_id, uuid, collection_name, name, file_name, 
                  mime_type, disk, conversions_disk, size, manipulations, 
                  custom_properties, generated_conversions, responsive_images, 
                  order_column, created_at, updated_at
                ) VALUES (
                  'App\\\\Models\\\\Banner', ?, ?, 'banner_image', ?, ?, 
                  ?, 'local_uploads', 'local_uploads', ?, '[]', 
                  '[]', '[]', '[]', 1, NOW(), NOW()
                )
            `;

            await pool.query(insertMediaQuery, [
                bannerId,
                mediaUuid,
                originalName,
                file.filename,
                file.mimetype,
                file.size
            ]);
        }

        res.status(201).json({ success: true, message: 'Banner created successfully', bannerId });
    } catch (error) {
        console.error('createBanner error:', error);
        res.status(500).json({ success: false, message: 'Failed to create banner: ' + error.message });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM banners WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        // Hard delete since there's no soft delete field in banners table
        await pool.query('DELETE FROM banners WHERE id = ?', [id]);
        res.json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('deleteBanner error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete banner: ' + error.message });
    }
};

module.exports = {
    getBanners,
    createBanner,
    deleteBanner
};
