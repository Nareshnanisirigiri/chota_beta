const { pool } = require('../config/database');

const getPromos = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', discount_type } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = ['deleted_at IS NULL'];
        let params = [];

        if (search) {
            whereClauses.push('(code LIKE ? OR description LIKE ?)');
            const pattern = `%${search}%`;
            params.push(pattern, pattern);
        }

        if (discount_type) {
            whereClauses.push('discount_type = ?');
            params.push(discount_type);
        }

        const whereSQL = `WHERE ${whereClauses.join(' AND ')}`;

        const [countResult] = await pool.query(`SELECT COUNT(*) AS total FROM promo ${whereSQL}`, params);
        const total = countResult[0].total;

        const [rows] = await pool.query(
            `SELECT * FROM promo ${whereSQL} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [...params, parsedLimit, offset]
        );

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
        console.error('getPromos error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch promos: ' + error.message });
    }
};

const createPromo = async (req, res) => {
    try {
        const {
            code,
            description,
            start_date,
            end_date,
            discount_type,
            discount_amount,
            promo_mode,
            max_total_usage,
            max_usage_per_user,
            min_order_total,
            max_discount_value,
            individual_use = 0
        } = req.body;

        if (!code || !discount_type) {
            return res.status(400).json({ success: false, message: 'Promo code and discount type are required' });
        }

        const query = `
            INSERT INTO promo (
                code, description, start_date, end_date, discount_type,
                discount_amount, promo_mode, max_total_usage, max_usage_per_user,
                min_order_total, max_discount_value, individual_use, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const [result] = await pool.query(query, [
            code,
            description || null,
            start_date || null,
            end_date || null,
            discount_type,
            discount_amount ? parseFloat(discount_amount) : null,
            promo_mode || 'instant',
            max_total_usage ? parseInt(max_total_usage) : null,
            max_usage_per_user ? parseInt(max_usage_per_user) : null,
            min_order_total ? parseFloat(min_order_total) : null,
            max_discount_value ? parseFloat(max_discount_value) : null,
            parseInt(individual_use)
        ]);

        res.status(201).json({ success: true, message: 'Promo code created successfully', promoId: result.insertId });
    } catch (error) {
        console.error('createPromo error:', error);
        res.status(500).json({ success: false, message: 'Failed to create promo: ' + error.message });
    }
};

const updatePromo = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            code,
            description,
            start_date,
            end_date,
            discount_type,
            discount_amount,
            promo_mode,
            max_total_usage,
            max_usage_per_user,
            min_order_total,
            max_discount_value,
            individual_use = 0
        } = req.body;

        const [existing] = await pool.query('SELECT id FROM promo WHERE id = ? AND deleted_at IS NULL', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Promo not found' });
        }

        const query = `
            UPDATE promo SET
                code = ?,
                description = ?,
                start_date = ?,
                end_date = ?,
                discount_type = ?,
                discount_amount = ?,
                promo_mode = ?,
                max_total_usage = ?,
                max_usage_per_user = ?,
                min_order_total = ?,
                max_discount_value = ?,
                individual_use = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        await pool.query(query, [
            code,
            description || null,
            start_date || null,
            end_date || null,
            discount_type,
            discount_amount ? parseFloat(discount_amount) : null,
            promo_mode || 'instant',
            max_total_usage ? parseInt(max_total_usage) : null,
            max_usage_per_user ? parseInt(max_usage_per_user) : null,
            min_order_total ? parseFloat(min_order_total) : null,
            max_discount_value ? parseFloat(max_discount_value) : null,
            parseInt(individual_use),
            id
        ]);

        res.json({ success: true, message: 'Promo code updated successfully' });
    } catch (error) {
        console.error('updatePromo error:', error);
        res.status(500).json({ success: false, message: 'Failed to update promo: ' + error.message });
    }
};

const deletePromo = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM promo WHERE id = ? AND deleted_at IS NULL', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Promo not found' });
        }

        // Soft delete since there is a deleted_at column
        await pool.query('UPDATE promo SET deleted_at = NOW() WHERE id = ?', [id]);
        res.json({ success: true, message: 'Promo deleted successfully' });
    } catch (error) {
        console.error('deletePromo error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete promo: ' + error.message });
    }
};

module.exports = {
    getPromos,
    createPromo,
    updatePromo,
    deletePromo
};
