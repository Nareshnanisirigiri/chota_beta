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
        const [rows] = await pool.query(`SELECT * FROM chota_beta.categories ORDER BY id DESC`);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
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
            INSERT INTO chota_beta.categories (uuid, parent_id, title, slug, description, status, requires_approval, commission, metadata, created_at, updated_at) 
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
        
        const [existing] = await pool.query('SELECT metadata FROM chota_beta.categories WHERE id = ?', [id]);
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
            UPDATE chota_beta.categories 
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
        await pool.query('DELETE FROM chota_beta.categories WHERE id = ?', [id]);
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete category: ' + error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
