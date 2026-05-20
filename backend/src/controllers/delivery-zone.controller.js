const { pool } = require('../config/database');
const slugify = require('slugify');

const getDeliveryZones = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = [];
        let params = [];

        if (search) {
            whereClauses.push('(name LIKE ? OR slug LIKE ?)');
            const pattern = `%${search}%`;
            params.push(pattern, pattern);
        }

        if (status) {
            whereClauses.push('status = ?');
            params.push(status);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [countResult] = await pool.query(`SELECT COUNT(*) AS total FROM delivery_zones ${whereSQL}`, params);
        const total = countResult[0].total;

        const [rows] = await pool.query(
            `SELECT * FROM delivery_zones ${whereSQL} ORDER BY id DESC LIMIT ? OFFSET ?`,
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
        console.error('getDeliveryZones error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch delivery zones: ' + error.message });
    }
};

const createDeliveryZone = async (req, res) => {
    try {
        const {
            name,
            center_latitude,
            center_longitude,
            radius_km = 0,
            rush_delivery_time_per_km,
            rush_delivery_charges,
            delivery_time_per_km,
            regular_delivery_charges,
            free_delivery_amount,
            distance_based_delivery_charges,
            per_store_drop_off_fee,
            handling_charges,
            delivery_boy_base_fee,
            delivery_boy_per_store_pickup_fee,
            delivery_boy_distance_based_fee,
            delivery_boy_per_order_incentive,
            buffer_time = 0,
            boundary_json = '[]',
            rush_delivery_enabled = 0,
            status = 'active'
        } = req.body;

        if (!name || !center_latitude || !center_longitude) {
            return res.status(400).json({ success: false, message: 'Name, center latitude, and center longitude are required' });
        }

        const slug = slugify(name, { lower: true, strict: true });

        const query = `
            INSERT INTO delivery_zones (
                name, slug, center_latitude, center_longitude, radius_km,
                rush_delivery_time_per_km, rush_delivery_charges, delivery_time_per_km,
                regular_delivery_charges, free_delivery_amount, distance_based_delivery_charges,
                per_store_drop_off_fee, handling_charges, delivery_boy_base_fee,
                delivery_boy_per_store_pickup_fee, delivery_boy_distance_based_fee,
                delivery_boy_per_order_incentive, buffer_time, boundary_json,
                rush_delivery_enabled, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const [result] = await pool.query(query, [
            name,
            slug,
            parseFloat(center_latitude),
            parseFloat(center_longitude),
            parseFloat(radius_km),
            rush_delivery_time_per_km ? parseInt(rush_delivery_time_per_km) : null,
            rush_delivery_charges ? parseInt(rush_delivery_charges) : null,
            parseInt(delivery_time_per_km || 0),
            parseInt(regular_delivery_charges || 0),
            free_delivery_amount ? parseInt(free_delivery_amount) : null,
            distance_based_delivery_charges ? parseInt(distance_based_delivery_charges) : null,
            per_store_drop_off_fee ? parseInt(per_store_drop_off_fee) : null,
            handling_charges ? parseInt(handling_charges) : null,
            delivery_boy_base_fee ? parseFloat(delivery_boy_base_fee) : null,
            delivery_boy_per_store_pickup_fee ? parseFloat(delivery_boy_per_store_pickup_fee) : null,
            delivery_boy_distance_based_fee ? parseFloat(delivery_boy_distance_based_fee) : null,
            delivery_boy_per_order_incentive ? parseFloat(delivery_boy_per_order_incentive) : null,
            parseInt(buffer_time),
            boundary_json,
            parseInt(rush_delivery_enabled) ? 1 : 0,
            status
        ]);

        res.status(201).json({ success: true, message: 'Delivery zone created successfully', zoneId: result.insertId });
    } catch (error) {
        console.error('createDeliveryZone error:', error);
        res.status(500).json({ success: false, message: 'Failed to create delivery zone: ' + error.message });
    }
};

const updateDeliveryZone = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            center_latitude,
            center_longitude,
            radius_km = 0,
            rush_delivery_time_per_km,
            rush_delivery_charges,
            delivery_time_per_km,
            regular_delivery_charges,
            free_delivery_amount,
            distance_based_delivery_charges,
            per_store_drop_off_fee,
            handling_charges,
            delivery_boy_base_fee,
            delivery_boy_per_store_pickup_fee,
            delivery_boy_distance_based_fee,
            delivery_boy_per_order_incentive,
            buffer_time = 0,
            boundary_json = '[]',
            rush_delivery_enabled = 0,
            status = 'active'
        } = req.body;

        const [existing] = await pool.query('SELECT id FROM delivery_zones WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Delivery zone not found' });
        }

        const slug = slugify(name, { lower: true, strict: true });

        const query = `
            UPDATE delivery_zones SET
                name = ?,
                slug = ?,
                center_latitude = ?,
                center_longitude = ?,
                radius_km = ?,
                rush_delivery_time_per_km = ?,
                rush_delivery_charges = ?,
                delivery_time_per_km = ?,
                regular_delivery_charges = ?,
                free_delivery_amount = ?,
                distance_based_delivery_charges = ?,
                per_store_drop_off_fee = ?,
                handling_charges = ?,
                delivery_boy_base_fee = ?,
                delivery_boy_per_store_pickup_fee = ?,
                delivery_boy_distance_based_fee = ?,
                delivery_boy_per_order_incentive = ?,
                buffer_time = ?,
                boundary_json = ?,
                rush_delivery_enabled = ?,
                status = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        await pool.query(query, [
            name,
            slug,
            parseFloat(center_latitude),
            parseFloat(center_longitude),
            parseFloat(radius_km),
            rush_delivery_time_per_km ? parseInt(rush_delivery_time_per_km) : null,
            rush_delivery_charges ? parseInt(rush_delivery_charges) : null,
            parseInt(delivery_time_per_km || 0),
            parseInt(regular_delivery_charges || 0),
            free_delivery_amount ? parseInt(free_delivery_amount) : null,
            distance_based_delivery_charges ? parseInt(distance_based_delivery_charges) : null,
            per_store_drop_off_fee ? parseInt(per_store_drop_off_fee) : null,
            handling_charges ? parseInt(handling_charges) : null,
            delivery_boy_base_fee ? parseFloat(delivery_boy_base_fee) : null,
            delivery_boy_per_store_pickup_fee ? parseFloat(delivery_boy_per_store_pickup_fee) : null,
            delivery_boy_distance_based_fee ? parseFloat(delivery_boy_distance_based_fee) : null,
            delivery_boy_per_order_incentive ? parseFloat(delivery_boy_per_order_incentive) : null,
            parseInt(buffer_time),
            boundary_json,
            parseInt(rush_delivery_enabled) ? 1 : 0,
            status,
            id
        ]);

        res.json({ success: true, message: 'Delivery zone updated successfully' });
    } catch (error) {
        console.error('updateDeliveryZone error:', error);
        res.status(500).json({ success: false, message: 'Failed to update delivery zone: ' + error.message });
    }
};

const deleteDeliveryZone = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM delivery_zones WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Delivery zone not found' });
        }

        await pool.query('DELETE FROM delivery_zones WHERE id = ?', [id]);
        res.json({ success: true, message: 'Delivery zone deleted successfully' });
    } catch (error) {
        console.error('deleteDeliveryZone error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete delivery zone: ' + error.message });
    }
};

module.exports = {
    getDeliveryZones,
    createDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone
};
