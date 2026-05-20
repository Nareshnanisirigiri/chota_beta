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
        const [rows] = await pool.query(`SELECT * FROM brands ORDER BY id DESC`);
        
        // Fetch all media files for Brand models to backfill images
        const [mediaRows] = await pool.query(
            "SELECT * FROM media WHERE model_type = ?",
            ["App\\Models\\Brand"]
        );

        // Map media by model_id and collection_name
        const mediaMap = {};
        mediaRows.forEach(m => {
            if (!mediaMap[m.model_id]) {
                mediaMap[m.model_id] = {};
            }
            mediaMap[m.model_id][m.collection_name] = m;
        });

        // Inject media urls into brand metadata dynamically
        const data = rows.map(b => {
            let metadata = {};
            try {
                metadata = b.metadata ? (typeof b.metadata === 'string' ? JSON.parse(b.metadata) : b.metadata) : {};
            } catch (e) {}

            const brandMedia = mediaMap[b.id];
            if (brandMedia) {
                const m = brandMedia['brand'] || brandMedia['logo'] || brandMedia['image'];
                if (m && !metadata.image) {
                    metadata.image = m.disk === 'local_uploads'
                        ? `${req.protocol}://${req.get('host')}/uploads/brands/${m.file_name}`
                        : `https://superadmin.chotabeta.com/storage/${m.id}/${m.file_name}`;
                }
            }

            return {
                ...b,
                metadata: JSON.stringify(metadata)
            };
        });

        res.json({ success: true, data });
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
            INSERT INTO brands (uuid, slug, title, description, scope_type, scope_id, status, metadata, created_at, updated_at) 
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
        
        const [existing] = await pool.query('SELECT metadata FROM brands WHERE id = ?', [id]);
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

        let query = `UPDATE brands SET title = ?, slug = ?, description = ?, scope_type = ?, scope_id = ?, status = ?, metadata = ?, updated_at = NOW() WHERE id = ?`;
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
        await pool.query('DELETE FROM brands WHERE id = ?', [id]);
        res.json({ success: true, message: 'Brand deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete brand: ' + error.message });
    }
};

const downloadBrandsTemplate = async (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=brands_template.csv');
    res.send("title,description,status,scope_type,scope_id,category_title\nSample Brand,Description of Brand,active,GLOBAL,,");
};

const bulkUploadBrands = async (req, res) => {
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
        const brandsToInsert = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Basic CSV row parsing
            const values = [];
            let current = '';
            let inQuotes = false;
            for (let j = 0; j < line.length; j++) {
                const MathChar = line[j];
                if (MathChar === '"') {
                    inQuotes = !inQuotes;
                } else if (MathChar === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += MathChar;
                }
            }
            values.push(current.trim());

            const row = {};
            headers.forEach((header, idx) => {
                row[header] = values[idx] || '';
            });

            if (!row.title && !row.brandname) continue;

            brandsToInsert.push({
                title: row.title || row.brandname,
                description: row.description || '',
                status: row.status || 'active',
                scope_type: row.scope_type || 'GLOBAL',
                scope_id: row.scope_id ? parseInt(row.scope_id) : null
            });
        }

        for (const brand of brandsToInsert) {
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            const slug = brand.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const metadata = JSON.stringify({ image: null });

            await pool.query(
                `INSERT INTO brands 
                 (uuid, slug, title, description, scope_type, scope_id, status, metadata, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [uuid, slug, brand.title, brand.description, brand.scope_type, brand.scope_id, brand.status, metadata]
            );
        }

        try {
            fs.unlinkSync(req.file.path);
        } catch(e) {}

        res.json({ success: true, message: `Successfully imported ${brandsToInsert.length} brands` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to import brands: ' + error.message });
    }
};

module.exports = {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    downloadBrandsTemplate,
    bulkUploadBrands
};
