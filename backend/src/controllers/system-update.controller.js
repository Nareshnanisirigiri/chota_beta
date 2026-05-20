const { pool } = require('../config/database');

const getSystemUpdates = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                su.id,
                su.version,
                su.package_name,
                su.status,
                su.applied_at,
                su.created_at,
                au.email AS applied_by_email
            FROM system_updates su
            LEFT JOIN admin_users au ON su.applied_by = au.id
            ORDER BY su.id DESC
        `);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('getSystemUpdates error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch system updates: ' + error.message });
    }
};

module.exports = {
    getSystemUpdates
};
