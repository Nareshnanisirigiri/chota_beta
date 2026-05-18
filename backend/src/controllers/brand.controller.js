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

const getBrands = async (req, res) => {
    try {
        const [schema] = await pool.query('DESCRIBE chota_beta.brands');
        console.log('BRANDS TABLE SCHEMA:', schema.map(c => c.Field));
        const [rows] = await pool.query(`SELECT * FROM chota_beta.brands ORDER BY id DESC`);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch brands: ' + error.message });
    }
};

const createBrand = async (req, res) => {
    try {
        const { brandName, description, scope_type, scope_id, status } = req.body;
        let metadata = {};

        if (req.files && req.files.logo) {
            metadata.image = '/uploads/brands/' + req.files.logo[0].filename;
        }

        const uuid = generateUUID();
        const slug = generateSlug(brandName || 'brand');
        const sId = scope_id ? parseInt(scope_id) : null;

        const query = `
            INSERT INTO chota_beta.brands (uuid, slug, title, description, scope_type, scope_id, status, metadata, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        await pool.query(query, [
            uuid,
            slug,
            brandName || '', 
            description || '', 
            scope_type || 'GLOBAL', 
            sId, 
            status === 'ACTIVE' ? 'active' : 'inactive', 
            JSON.stringify(metadata)
        ]);
        
        res.status(201).json({ success: true, message: 'Brand created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create brand: ' + error.message });
    }
};

const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { brandName, description, scope_type, scope_id, status } = req.body;
        
        const [existing] = await pool.query('SELECT metadata FROM chota_beta.brands WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Brand not found' });
        }
        
        let metadata = {};
        try {
            if (existing[0].metadata) {
                metadata = typeof existing[0].metadata === 'string' ? JSON.parse(existing[0].metadata) : existing[0].metadata;
            }
        } catch (e) {
            console.error('Error parsing metadata:', e);
        }

        if (req.files && req.files.logo) {
            metadata.image = '/uploads/brands/' + req.files.logo[0].filename;
        }

        const slug = generateSlug(brandName || 'brand');
        const sId = scope_id ? parseInt(scope_id) : null;
        const metadataString = JSON.stringify(metadata);

        console.log('UPDATING BRAND:', { id, brandName, status, metadata: metadataString });

        let query = `UPDATE chota_beta.brands SET title = ?, slug = ?, description = ?, scope_type = ?, scope_id = ?, status = ?, metadata = ?, updated_at = NOW() WHERE id = ?`;
        const params = [
            brandName || '', 
            slug,
            description || '', 
            scope_type || 'GLOBAL',
            sId,
            status === 'ACTIVE' ? 'active' : 'inactive',
            metadataString,
            id
        ];

        await pool.query(query, params);
        
        res.json({ success: true, message: 'Brand updated successfully' });
    } catch (error) {
        console.error('SQL UPDATE ERROR:', error);
        res.status(500).json({ success: false, message: 'Failed to update brand: ' + error.message });
    }
};

const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM chota_beta.brands WHERE id = ?', [id]);
        res.json({ success: true, message: 'Brand deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete brand: ' + error.message });
    }
};

module.exports = {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand
};
