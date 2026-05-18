const { pool } = require('../config/database');

const getSellers = async (req, res) => {
    try {
        // Query to fetch sellers joined with users table and counting stores
        const [rows] = await pool.query(`
            SELECT 
                s.id,
                s.user_id,
                u.name AS seller,
                u.email,
                u.mobile,
                s.verification_status AS verificationStatus,
                s.visibility_status AS visibilityStatus,
                (SELECT COUNT(*) FROM stores WHERE seller_id = s.id) AS stores,
                s.created_at AS createdAt
            FROM sellers s
            LEFT JOIN users u ON s.user_id = u.id
            ORDER BY s.id DESC
        `);
        
        console.log(`FETCHED ${rows.length} COMPREHENSIVE SELLERS`);
        
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        console.error('Error fetching sellers:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sellers: ' + error.message });
    }
};

module.exports = {
    getSellers
};
