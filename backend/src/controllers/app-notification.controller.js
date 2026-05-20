const { pool } = require('../config/database');

const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', audience_type } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = [];
        let params = [];

        if (search) {
            whereClauses.push('(title LIKE ? OR message LIKE ?)');
            const pattern = `%${search}%`;
            params.push(pattern, pattern);
        }

        if (audience_type) {
            whereClauses.push('audience_type = ?');
            params.push(audience_type);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [countResult] = await pool.query(`SELECT COUNT(*) AS total FROM app_notifications ${whereSQL}`, params);
        const total = countResult[0].total;

        const [rows] = await pool.query(
            `SELECT * FROM app_notifications ${whereSQL} ORDER BY id DESC LIMIT ? OFFSET ?`,
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
        console.error('getNotifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications: ' + error.message });
    }
};

const createNotification = async (req, res) => {
    try {
        const { audience_type, title, message, target_type, metadata } = req.body;
        if (!audience_type || !title || !message) {
            return res.status(400).json({ success: false, message: 'Audience type, title, and message are required' });
        }

        const query = `
            INSERT INTO app_notifications (
                audience_type, title, message, target_type, metadata, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;
        const [result] = await pool.query(query, [
            audience_type,
            title,
            message,
            target_type || null,
            metadata || null
        ]);

        res.status(201).json({ success: true, message: 'Notification created and sent successfully', notificationId: result.insertId });
    } catch (error) {
        console.error('createNotification error:', error);
        res.status(500).json({ success: false, message: 'Failed to create notification: ' + error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM app_notifications WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        await pool.query('DELETE FROM app_notifications WHERE id = ?', [id]);
        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('deleteNotification error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete notification: ' + error.message });
    }
};

module.exports = {
    getNotifications,
    createNotification,
    deleteNotification
};
