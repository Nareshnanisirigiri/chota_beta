const { pool } = require('../config/database');

// GET /api/sellers
const getSellers = async (req, res) => {
    try {
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
        
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        console.error('Error fetching sellers:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sellers: ' + error.message });
    }
};

// GET /api/sellers/:id
const getSellerById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT 
                s.*,
                u.name AS seller,
                u.email,
                u.mobile
            FROM sellers s
            LEFT JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Seller not found' });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching seller details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch seller details: ' + error.message });
    }
};

// PUT /api/sellers/:id
const updateSeller = async (req, res) => {
    const { id } = req.params;
    const {
        seller,
        email,
        mobile,
        address,
        city,
        landmark,
        state,
        zipcode,
        country,
        verificationStatus,
        visibilityStatus
    } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get user_id associated with this seller
        const [sellers] = await connection.query('SELECT user_id FROM sellers WHERE id = ?', [id]);
        if (sellers.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Seller not found' });
        }
        const userId = sellers[0].user_id;

        // 2. Update users table (basic info)
        await connection.query(`
            UPDATE users 
            SET name = ?, email = ?, mobile = ? 
            WHERE id = ?
        `, [seller, email, mobile, userId]);

        // 3. Update sellers table (address, statuses, etc.)
        await connection.query(`
            UPDATE sellers 
            SET 
                address = ?, 
                city = ?, 
                landmark = ?, 
                state = ?, 
                zipcode = ?, 
                country = ?, 
                verification_status = ?, 
                visibility_status = ? 
            WHERE id = ?
        `, [
            address || null, 
            city || null, 
            landmark || null, 
            state || null, 
            zipcode || null, 
            country || 'India', 
            verificationStatus || 'approved', 
            visibilityStatus || 'visible', 
            id
        ]);

        await connection.commit();
        res.json({ success: true, message: 'Seller updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating seller:', error);
        res.status(500).json({ success: false, message: 'Failed to update seller: ' + error.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    getSellers,
    getSellerById,
    updateSeller
};
