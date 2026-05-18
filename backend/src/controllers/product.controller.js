const { pool } = require('../config/database');

// GET /api/products
const getProducts = async (req, res) => {
    try {
        // Attempt query with category and brand joins
        const [rows] = await pool.query(`
            SELECT 
                p.*,
                c.title AS categoryName,
                b.title AS brandName,
                m.id AS mediaId,
                m.file_name AS productImage
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN (
              SELECT model_id, MIN(id) as first_media_id 
              FROM media 
              WHERE model_type = 'App\\\\Models\\\\Product' 
              GROUP BY model_id
            ) m_ref ON p.id = m_ref.model_id
            LEFT JOIN media m ON m.id = m_ref.first_media_id
            ORDER BY p.id DESC
        `);

        // Map database records to camelCase properties for frontend rendering
        const mappedRows = rows.map(item => {
            const title = item.name || item.title || item.product_name || 'Unnamed Product';
            const category = item.categoryName || item.category_name || item.category || 'N/A';
            const brand = item.brandName || item.brand_name || item.brand || '';

            let featured = 'No';
            if (item.is_featured === 1 || item.is_featured === true || item.featured === 1 || item.featured === 'Yes' || String(item.featured).toLowerCase() === 'yes') {
                featured = 'Yes';
            }

            const approvalStatus = item.verification_status || item.approval_status || item.status || 'Verification Status';

            let image = 'https://via.placeholder.com/150?text=Product';
            if (item.mediaId && item.productImage) {
                image = `https://superadmin.chotabeta.com/storage/${item.mediaId}/${item.productImage}`;
            } else if (item.image) {
                image = item.image;
            } else if (item.thumbnail) {
                image = item.thumbnail;
            } else if (item.images) {
                try {
                    const parsed = JSON.parse(item.images);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        image = parsed[0];
                    } else if (typeof parsed === 'string') {
                        image = parsed;
                    }
                } catch {
                    if (typeof item.images === 'string') {
                        image = item.images;
                    }
                }
            }

            if (image && !image.startsWith('http') && !image.startsWith('data:')) {
                image = `http://localhost:5000${image.startsWith('/') ? '' : '/'}${image}`;
            }

            return {
                id: item.id,
                title: title,
                category: category,
                brand: brand,
                featured: featured,
                type: item.type || 'Product Type',
                status: item.status || 'ACTIVE',
                approvalStatus: approvalStatus,
                createdAt: item.created_at || item.createdAt || new Date().toISOString(),
                image: image
            };
        });

        res.json({
            success: true,
            data: mappedRows
        });
    } catch (error) {
        console.error('Error fetching products with joins:', error);

        // Robust Fallback: Run raw SELECT * FROM products as requested by user
        try {
            console.log('Falling back to raw SELECT * FROM products...');
            const [simpleRows] = await pool.query("SELECT * FROM products ORDER BY id DESC");

            const mappedRows = simpleRows.map(item => {
                const title = item.name || item.title || item.product_name || 'Unnamed Product';
                const approvalStatus = item.verification_status || item.approval_status || item.status || 'Verification Status';

                let image = 'https://via.placeholder.com/150?text=Product';
                if (item.image) image = item.image;
                else if (item.thumbnail) image = item.thumbnail;

                if (image && !image.startsWith('http') && !image.startsWith('data:')) {
                    image = `http://localhost:5000${image.startsWith('/') ? '' : '/'}${image}`;
                }

                return {
                    id: item.id,
                    title: title,
                    category: item.category_id ? `Category ${item.category_id}` : 'N/A',
                    brand: item.brand_id ? `Brand ${item.brand_id}` : 'N/A',
                    featured: item.is_featured ? 'Yes' : 'No',
                    type: item.type || 'Product Type',
                    status: item.status || 'ACTIVE',
                    approvalStatus: approvalStatus,
                    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
                    image: image
                };
            });

            res.json({
                success: true,
                data: mappedRows
            });
        } catch (fallbackErr) {
            console.error('Fallback products query failed:', fallbackErr);
            res.status(500).json({ success: false, message: 'Failed to fetch products: ' + fallbackErr.message });
        }
    }
};
const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = req.body.status || req.body.approvalStatus || req.body.verification_status || req.body.verificationStatus;

        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required' });
        }

        // Map status input to database enum: 'pending_verification', 'rejected', 'approved'
        let mappedStatus = 'approved';
        const lowerStatus = String(status).toLowerCase();
        if (lowerStatus === 'pending' || lowerStatus === 'pending_verification') {
            mappedStatus = 'pending_verification';
        } else if (lowerStatus === 'rejected') {
            mappedStatus = 'rejected';
        }

        const queryStr = `
            UPDATE products 
            SET verification_status = ?, updated_at = NOW() 
            WHERE id = ?
        `;

        await pool.query(queryStr, [mappedStatus, id]);

        res.json({
            success: true,
            message: 'Product verification status updated successfully'
        });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product status: ' + error.message
        });
    }
};

module.exports = {
    getProducts,
    updateProductStatus
};
