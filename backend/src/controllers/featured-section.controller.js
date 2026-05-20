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

const getFeaturedSections = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            section_type,
            status,
            scope_type
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = [];
        let params = [];

        if (search) {
            whereClauses.push('(fs.title LIKE ? OR fs.slug LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        if (section_type) {
            whereClauses.push('fs.section_type = ?');
            params.push(section_type);
        }

        if (status) {
            whereClauses.push('fs.status = ?');
            params.push(status);
        }

        if (scope_type) {
            whereClauses.push('fs.scope_type = ?');
            params.push(scope_type);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Query total count
        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM featured_sections fs
            ${whereSQL}
        `;
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;

        // Query paginated rows with media and linked categories
        const selectQuery = `
            SELECT 
              fs.*,
              (
                SELECT GROUP_CONCAT(cfs.category_id)
                FROM category_featured_section cfs
                WHERE cfs.featured_section_id = fs.id
              ) as category_ids,
              (
                SELECT GROUP_CONCAT(c.title SEPARATOR ', ')
                FROM category_featured_section cfs
                JOIN categories c ON c.id = cfs.category_id
                WHERE cfs.featured_section_id = fs.id
              ) as category_titles,
              m.id as media_id,
              m.file_name as file_name,
              m.disk as disk,
              sc.title as scope_category_title
            FROM featured_sections fs
            LEFT JOIN media m ON m.model_id = fs.id AND m.model_type = 'App\\\\Models\\\\FeaturedSection' AND m.collection_name LIKE 'featured_section_bg%'
            LEFT JOIN categories sc ON fs.scope_type = 'category' AND fs.scope_id = sc.id
            ${whereSQL}
            GROUP BY fs.id, m.id, m.file_name, m.disk, sc.title
            ORDER BY fs.sort_order ASC, fs.id DESC
            LIMIT ? OFFSET ?
        `;
        
        const queryParams = [...params, parsedLimit, offset];
        const [rows] = await pool.query(selectQuery, queryParams);

        // Parse category_ids into array
        const processedRows = rows.map(row => {
            row.category_ids = row.category_ids ? row.category_ids.split(',').map(Number) : [];
            return row;
        });

        res.json({
            success: true,
            data: processedRows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parsedLimit,
                totalPages: Math.ceil(total / parsedLimit)
            }
        });
    } catch (error) {
        console.error('getFeaturedSections error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch featured sections: ' + error.message });
    }
};

const createFeaturedSection = async (req, res) => {
    let connection;
    try {
        const { 
            title, 
            scope_type, 
            scope_id, 
            short_description, 
            style, 
            background_type, 
            background_color, 
            text_color, 
            section_type, 
            sort_order, 
            status,
            category_ids // Array or comma separated string of category IDs
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Section title is required' });
        }

        if (!section_type) {
            return res.status(400).json({ success: false, message: 'Section type is required' });
        }

        const slug = generateSlug(title) + '-' + Math.floor(Math.random() * 1000);

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const insertQuery = `
            INSERT INTO featured_sections (
              scope_type, scope_id, title, slug, short_description, style, 
              background_type, background_color, text_color, section_type, 
              sort_order, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const parsedScopeId = scope_id ? parseInt(scope_id) : null;
        const parsedSortOrder = sort_order ? parseInt(sort_order) : 0;

        const [sectionResult] = await connection.query(insertQuery, [
            scope_type || 'global',
            parsedScopeId,
            title,
            slug,
            short_description || null,
            style || 'without_background',
            background_type || null,
            background_color || null,
            text_color || '#000000',
            section_type,
            parsedSortOrder,
            status || 'active'
        ]);

        const sectionId = sectionResult.insertId;

        // Map categories if present
        let targetCategoryIds = [];
        if (category_ids) {
            if (Array.isArray(category_ids)) {
                targetCategoryIds = category_ids.map(Number);
            } else if (typeof category_ids === 'string') {
                targetCategoryIds = category_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            }
        }

        if (targetCategoryIds.length > 0) {
            const insertMappingQuery = `
                INSERT INTO category_featured_section (
                  category_id, featured_section_id, created_at, updated_at
                ) VALUES ?
            `;
            const values = targetCategoryIds.map(catId => [catId, sectionId, new Date(), new Date()]);
            await connection.query(insertMappingQuery, [values]);
        }

        // Upload media if present
        if (req.files && req.files.image && req.files.image[0]) {
            const file = req.files.image[0];
            const mediaUuid = generateUUID();
            const originalName = file.originalname.split('.').slice(0, -1).join('.') || 'bg';

            const insertMediaQuery = `
                INSERT INTO media (
                  model_type, model_id, uuid, collection_name, name, file_name, 
                  mime_type, disk, conversions_disk, size, manipulations, 
                  custom_properties, generated_conversions, responsive_images, 
                  order_column, created_at, updated_at
                ) VALUES (
                  'App\\\\Models\\\\FeaturedSection', ?, ?, 'featured_section_bg_desktop_fhd', ?, ?, 
                  ?, 'local_uploads', 'local_uploads', ?, '[]', 
                  '[]', '[]', '[]', 1, NOW(), NOW()
                )
            `;

            await connection.query(insertMediaQuery, [
                sectionId,
                mediaUuid,
                originalName,
                file.filename,
                file.mimetype,
                file.size
            ]);
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Featured section created successfully', sectionId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('createFeaturedSection error:', error);
        res.status(500).json({ success: false, message: 'Failed to create featured section: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
};

const updateFeaturedSection = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { 
            title, 
            scope_type, 
            scope_id, 
            short_description, 
            style, 
            background_type, 
            background_color, 
            text_color, 
            section_type, 
            sort_order, 
            status,
            category_ids
        } = req.body;

        const [existing] = await pool.query('SELECT id FROM featured_sections WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Featured section not found' });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const updateQuery = `
            UPDATE featured_sections SET
              scope_type = ?,
              scope_id = ?,
              title = ?,
              short_description = ?,
              style = ?,
              background_type = ?,
              background_color = ?,
              text_color = ?,
              section_type = ?,
              sort_order = ?,
              status = ?,
              updated_at = NOW()
            WHERE id = ?
        `;

        const parsedScopeId = scope_id ? parseInt(scope_id) : null;
        const parsedSortOrder = sort_order ? parseInt(sort_order) : 0;

        await connection.query(updateQuery, [
            scope_type || 'global',
            parsedScopeId,
            title,
            short_description || null,
            style || 'without_background',
            background_type || null,
            background_color || null,
            text_color || '#000000',
            section_type,
            parsedSortOrder,
            status || 'active',
            id
        ]);

        // Update categories: first delete, then insert
        await connection.query('DELETE FROM category_featured_section WHERE featured_section_id = ?', [id]);

        let targetCategoryIds = [];
        if (category_ids) {
            if (Array.isArray(category_ids)) {
                targetCategoryIds = category_ids.map(Number);
            } else if (typeof category_ids === 'string') {
                targetCategoryIds = category_ids.split(',').map(catId => parseInt(catId.trim())).filter(catId => !isNaN(catId));
            }
        }

        if (targetCategoryIds.length > 0) {
            const insertMappingQuery = `
                INSERT INTO category_featured_section (
                  category_id, featured_section_id, created_at, updated_at
                ) VALUES ?
            `;
            const values = targetCategoryIds.map(catId => [catId, id, new Date(), new Date()]);
            await connection.query(insertMappingQuery, [values]);
        }

        // Upload media if present (replace old background)
        if (req.files && req.files.image && req.files.image[0]) {
            // Delete old media first
            await connection.query('DELETE FROM media WHERE model_id = ? AND model_type = "App\\\\Models\\\\FeaturedSection"', [id]);

            const file = req.files.image[0];
            const mediaUuid = generateUUID();
            const originalName = file.originalname.split('.').slice(0, -1).join('.') || 'bg';

            const insertMediaQuery = `
                INSERT INTO media (
                  model_type, model_id, uuid, collection_name, name, file_name, 
                  mime_type, disk, conversions_disk, size, manipulations, 
                  custom_properties, generated_conversions, responsive_images, 
                  order_column, created_at, updated_at
                ) VALUES (
                  'App\\\\Models\\\\FeaturedSection', ?, ?, 'featured_section_bg_desktop_fhd', ?, ?, 
                  ?, 'local_uploads', 'local_uploads', ?, '[]', 
                  '[]', '[]', '[]', 1, NOW(), NOW()
                )
            `;

            await connection.query(insertMediaQuery, [
                id,
                mediaUuid,
                originalName,
                file.filename,
                file.mimetype,
                file.size
            ]);
        }

        await connection.commit();
        res.json({ success: true, message: 'Featured section updated successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('updateFeaturedSection error:', error);
        res.status(500).json({ success: false, message: 'Failed to update featured section: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
};

const deleteFeaturedSection = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM featured_sections WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Featured section not found' });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Delete mappings, media and the featured section
        await connection.query('DELETE FROM category_featured_section WHERE featured_section_id = ?', [id]);
        await connection.query('DELETE FROM media WHERE model_id = ? AND model_type = "App\\\\Models\\\\FeaturedSection"', [id]);
        await connection.query('DELETE FROM featured_sections WHERE id = ?', [id]);

        await connection.commit();
        res.json({ success: true, message: 'Featured section deleted successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('deleteFeaturedSection error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete featured section: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
};

const updateSortOrder = async (req, res) => {
    let connection;
    try {
        const { orders } = req.body; // Array of { id, sort_order }
        if (!orders || !Array.isArray(orders)) {
            return res.status(400).json({ success: false, message: 'Orders array is required' });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const item of orders) {
            await connection.query(
                'UPDATE featured_sections SET sort_order = ?, updated_at = NOW() WHERE id = ?',
                [parseInt(item.sort_order), parseInt(item.id)]
            );
        }

        await connection.commit();
        res.json({ success: true, message: 'Featured sections reordered successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('updateSortOrder error:', error);
        res.status(500).json({ success: false, message: 'Failed to reorder featured sections: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getFeaturedSections,
    createFeaturedSection,
    updateFeaturedSection,
    deleteFeaturedSection,
    updateSortOrder
};
