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

const getCategories = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM categories ORDER BY id DESC`);
        
        // Fetch all media files for Category models to backfill images
        const [mediaRows] = await pool.query(
            "SELECT * FROM media WHERE model_type = ?",
            ["App\\Models\\Category"]
        );

        // Map media by model_id and collection_name
        const mediaMap = {};
        mediaRows.forEach(m => {
            if (!mediaMap[m.model_id]) {
                mediaMap[m.model_id] = {};
            }
            mediaMap[m.model_id][m.collection_name] = m;
        });

        // Inject media urls into category metadata dynamically
        const data = rows.map(c => {
            let metadata = {};
            try {
                metadata = c.metadata ? (typeof c.metadata === 'string' ? JSON.parse(c.metadata) : c.metadata) : {};
            } catch (e) {}

            const categoryMedia = mediaMap[c.id];
            if (categoryMedia) {
                if (!metadata.image && categoryMedia['image']) {
                    const m = categoryMedia['image'];
                    metadata.image = m.disk === 'local_uploads'
                        ? `${req.protocol}://${req.get('host')}/uploads/categories/${m.file_name}`
                        : `https://superadmin.chotabeta.com/storage/${m.id}/${m.file_name}`;
                }
                if (!metadata.banner && categoryMedia['banner']) {
                    const m = categoryMedia['banner'];
                    metadata.banner = m.disk === 'local_uploads'
                        ? `${req.protocol}://${req.get('host')}/uploads/categories/${m.file_name}`
                        : `https://superadmin.chotabeta.com/storage/${m.id}/${m.file_name}`;
                }
                if (!metadata.icon && (categoryMedia['category_icon'] || categoryMedia['icon'])) {
                    const m = categoryMedia['category_icon'] || categoryMedia['icon'];
                    metadata.icon = m.disk === 'local_uploads'
                        ? `${req.protocol}://${req.get('host')}/uploads/categories/${m.file_name}`
                        : `https://superadmin.chotabeta.com/storage/${m.id}/${m.file_name}`;
                }
                if (!metadata.activeIcon && (categoryMedia['category_active_icon'] || categoryMedia['activeIcon'])) {
                    const m = categoryMedia['category_active_icon'] || categoryMedia['activeIcon'];
                    metadata.activeIcon = m.disk === 'local_uploads'
                        ? `${req.protocol}://${req.get('host')}/uploads/categories/${m.file_name}`
                        : `https://superadmin.chotabeta.com/storage/${m.id}/${m.file_name}`;
                }
            }

            return {
                ...c,
                metadata: JSON.stringify(metadata)
            };
        });

        res.json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { title, description, parent_id, commission, status, requires_approval, backgroundType, backgroundColor, fontColor } = req.body;
        const metadata = { backgroundType, backgroundColor, fontColor };
        
        if (req.files) {
            if (req.files.image) metadata.image = '/uploads/categories/' + req.files.image[0].filename;
            if (req.files.banner) metadata.banner = '/uploads/categories/' + req.files.banner[0].filename;
            if (req.files.icon) metadata.icon = '/uploads/categories/' + req.files.icon[0].filename;
            if (req.files.activeIcon) metadata.activeIcon = '/uploads/categories/' + req.files.activeIcon[0].filename;
        }

        const uuid = generateUUID();
        const slug = generateSlug(title || 'category');

        const query = `
            INSERT INTO categories (uuid, parent_id, title, slug, description, status, requires_approval, commission, metadata, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const pId = parent_id ? parseInt(parent_id) : null;
        const comm = commission ? parseFloat(commission) : 0;
        const stat = status === 'active' ? 'active' : 'inactive';
        const reqApp = requires_approval === '1' || requires_approval === 'true' ? 1 : 0;

        await pool.query(query, [uuid, pId, title, slug, description, stat, reqApp, comm, JSON.stringify(metadata)]);
        
        res.status(201).json({ success: true, message: 'Category created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create category: ' + error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, parent_id, commission, status, requires_approval, backgroundType, backgroundColor, fontColor } = req.body;
        
        const [existing] = await pool.query('SELECT metadata FROM categories WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        let metadata = {};
        try {
            metadata = existing[0].metadata ? JSON.parse(existing[0].metadata) : {};
        } catch (e) {}

        if (backgroundType) metadata.backgroundType = backgroundType;
        if (backgroundColor) metadata.backgroundColor = backgroundColor;
        if (fontColor) metadata.fontColor = fontColor;

        if (req.files) {
            if (req.files.image) metadata.image = '/uploads/categories/' + req.files.image[0].filename;
            if (req.files.banner) metadata.banner = '/uploads/categories/' + req.files.banner[0].filename;
            if (req.files.icon) metadata.icon = '/uploads/categories/' + req.files.icon[0].filename;
            if (req.files.activeIcon) metadata.activeIcon = '/uploads/categories/' + req.files.activeIcon[0].filename;
        }

        // Handle image removals
        if (req.body.remove_image) delete metadata.image;
        if (req.body.remove_banner) delete metadata.banner;
        if (req.body.remove_icon) delete metadata.icon;
        if (req.body.remove_activeIcon) delete metadata.activeIcon;

        const slug = generateSlug(title || 'category');
        const pId = parent_id ? parseInt(parent_id) : null;
        const comm = commission ? parseFloat(commission) : 0;
        const stat = status === 'active' ? 'active' : 'inactive';
        const reqApp = requires_approval === '1' || requires_approval === 'true' ? 1 : 0;

        const query = `
            UPDATE categories 
            SET parent_id = ?, title = ?, slug = ?, description = ?, status = ?, requires_approval = ?, commission = ?, metadata = ?, updated_at = NOW() 
            WHERE id = ?
        `;

        await pool.query(query, [pId, title, slug, description, stat, reqApp, comm, JSON.stringify(metadata), id]);
        
        res.json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update category: ' + error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete category: ' + error.message });
    }
};

const saveHomeCategoriesOrder = async (req, res) => {
    try {
        const { categoryIds } = req.body;
        if (!Array.isArray(categoryIds)) {
            return res.status(400).json({ success: false, message: 'categoryIds array is required' });
        }

        // Reset all home categories
        await pool.query('UPDATE categories SET is_home_category = 0, sort_order = 9999');

        // Update home categories and their sort order
        for (let i = 0; i < categoryIds.length; i++) {
            const id = categoryIds[i];
            await pool.query('UPDATE categories SET is_home_category = 1, sort_order = ? WHERE id = ?', [i, id]);
        }

        res.json({ success: true, message: 'Home categories order saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save categories order: ' + error.message });
    }
};

const bulkUploadCategories = async (req, res) => {
    const fs = require('fs');
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        const lines = fileContent.split(/\r?\n/);
        if (lines.length < 2) {
            return res.status(400).json({ success: false, message: 'CSV file is empty or has no data rows' });
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const categoriesToInsert = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Basic CSV row parsing
            const values = [];
            let current = '';
            let inQuotes = false;
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());

            const row = {};
            headers.forEach((header, idx) => {
                row[header] = values[idx] || '';
            });

            if (!row.title) continue;

            categoriesToInsert.push({
                title: row.title,
                parent_id: row.parent_id ? parseInt(row.parent_id) : null,
                description: row.description || '',
                status: row.status || 'active',
                requires_approval: row.requires_approval === '1' || row.requires_approval === 'true' ? 1 : 0,
                commission: parseFloat(row.commission) || 0,
                background_type: row.background_type || 'Color',
                background_color: row.background_color || '#000000',
                font_color: row.font_color || '#000000',
            });
        }

        for (const cat of categoriesToInsert) {
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            const slug = cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const metadata = JSON.stringify({
                backgroundType: cat.background_type,
                backgroundColor: cat.background_color,
                fontColor: cat.font_color,
                image: null,
                banner: null,
                icon: null,
                activeIcon: null
            });

            await pool.query(
                `INSERT INTO categories 
                 (uuid, parent_id, title, slug, description, status, requires_approval, commission, background_type, background_color, font_color, metadata, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [uuid, cat.parent_id, cat.title, slug, cat.description, cat.status, cat.requires_approval, cat.commission, cat.background_type, cat.background_color, cat.font_color, metadata]
            );
        }

        try {
            fs.unlinkSync(req.file.path);
        } catch(e) {}

        res.json({ success: true, message: `Successfully imported ${categoriesToInsert.length} categories` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to import categories: ' + error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    saveHomeCategoriesOrder,
    bulkUploadCategories
};
