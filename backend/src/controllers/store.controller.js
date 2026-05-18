const { pool } = require('../config/database');

// GET /api/stores
const getStores = async (req, res) => {
    try {
        let rows;
        try {
            // Attempt query with seller name joins
            const [joinedRows] = await pool.query(`
                SELECT 
                    s.*,
                    s.contact_number AS contactNumber,
                    s.verification_status AS verificationStatus,
                    s.visibility_status AS visibilityStatus,
                    s.created_at AS createdAt,
                    u.name AS sellerName
                FROM stores s
                LEFT JOIN sellers sel ON s.seller_id = sel.id
                LEFT JOIN users u ON sel.user_id = u.id
                ORDER BY s.id DESC
            `);
            rows = joinedRows;
        } catch (queryErr) {
            console.warn('Complex store query failed, falling back to simple SELECT * FROM stores:', queryErr);
            // Fallback to simple select all stores as requested
            const [simpleRows] = await pool.query("SELECT * FROM stores ORDER BY id DESC");
            rows = simpleRows.map(s => ({
                ...s,
                contactNumber: s.contact_number || s.contactNumber || '',
                verificationStatus: s.verification_status || s.verificationStatus || 'approved',
                visibilityStatus: s.visibility_status || s.visibilityStatus || 'visible',
                createdAt: s.created_at || s.createdAt || new Date().toISOString(),
                sellerName: 'N/A'
            }));
        }
        
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stores: ' + error.message });
    }
};

// GET /api/stores/:id
const getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                s.*,
                s.contact_number AS contactNumber,
                s.verification_status AS verificationStatus,
                s.visibility_status AS visibilityStatus,
                s.created_at AS createdAt,
                s.contact_email AS contactEmail,
                s.fulfillment_type AS fulfillmentType,
                s.tax_name AS taxName,
                s.tax_number AS taxNumber,
                s.bank_name AS bankName,
                s.bank_branch_code AS bankBranchCode,
                s.account_holder_name AS accountHolderName,
                s.account_number AS accountNumber,
                s.routing_number AS routingNumber,
                s.bank_account_type AS bankAccountType,
                s.currency_code AS currencyCode,
                u.name AS sellerName,
                u.email AS sellerEmail
            FROM stores s
            LEFT JOIN sellers sel ON s.seller_id = sel.id
            LEFT JOIN users u ON sel.user_id = u.id
            WHERE s.id = ?
        `, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }
        
        res.json({ 
            success: true, 
            data: rows[0] 
        });
    } catch (error) {
        console.error('Error fetching store details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch store details: ' + error.message });
    }
};

// PUT /api/stores/:id/status
const updateStoreStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { verificationStatus, visibilityStatus } = req.body;
        
        // Map frontend values to database enum
        let dbVerification = 'not_approved';
        if (verificationStatus && verificationStatus.toLowerCase() === 'approved') {
            dbVerification = 'approved';
        }
        
        let dbVisibility = 'draft';
        if (visibilityStatus && visibilityStatus.toLowerCase() === 'visible') {
            dbVisibility = 'visible';
        }
        
        const [result] = await pool.query(`
            UPDATE stores 
            SET 
                verification_status = ?, 
                visibility_status = ?,
                updated_at = NOW()
            WHERE id = ?
        `, [dbVerification, dbVisibility, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }
        
        res.json({ 
            success: true, 
            message: 'Store status updated successfully' 
        });
    } catch (error) {
        console.error('Error updating store status:', error);
        res.status(500).json({ success: false, message: 'Failed to update store status: ' + error.message });
    }
};

module.exports = {
    getStores,
    getStoreById,
    updateStoreStatus
};

