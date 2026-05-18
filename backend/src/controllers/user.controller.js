const { pool } = require('../config/database');

const getCustomers = async (req, res) => {
    try {
        const [schema] = await pool.query('DESCRIBE users');
        console.log('USERS TABLE SCHEMA:', schema.map(c => c.Field));
        // Query to fetch users who are customers (usually access_panel = 0 or specific role)
        // For now, fetching all users from users table as per user request
        const [rows] = await pool.query(`
            SELECT *
            FROM users 
            ORDER BY id DESC
        `);
        console.log(`FETCHED ${rows.length} CUSTOMERS`);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch customers: ' + error.message });
    }
};

module.exports = {
    getCustomers
};
