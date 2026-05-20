const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


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

        // Fetch documents from media table
        const [mediaRows] = await pool.query(`
            SELECT * FROM media 
            WHERE model_type = 'App\\\\Models\\\\Seller' AND model_id = ?
        `, [id]);

        const documents = {};
        mediaRows.forEach(m => {
            const keyMap = {
                'business_license': 'license',
                'articles_of_incorporation': 'incorporation',
                'national_identity_card': 'idcard',
                'authorized_signature': 'signature'
            };
            const frontendKey = keyMap[m.collection_name];
            if (frontendKey) {
                const sizeKb = (m.size / 1024).toFixed(1) + ' KB';
                const previewUrl = m.disk === 'local_uploads'
                    ? `${req.protocol}://${req.get('host')}/uploads/sellers/${m.file_name}`
                    : `https://superadmin.chotabeta.com/storage/${m.id}/${m.file_name}`;
                documents[frontendKey] = {
                    preview: previewUrl,
                    size: sizeKb,
                    file: {
                        name: m.file_name,
                        type: m.mime_type || 'image/jpeg'
                    }
                };
            }
        });

        const sellerData = {
            ...rows[0],
            documents
        };

        res.json({
            success: true,
            data: sellerData
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
            address || '', 
            city || '', 
            landmark || '', 
            state || '', 
            zipcode || '',  
            country || 'India', 
            verificationStatus || 'approved', 
            visibilityStatus || 'visible', 
            id
        ]);

        // 4. Update documents
        const documentFields = {
            'license': 'business_license',
            'incorporation': 'articles_of_incorporation',
            'idcard': 'national_identity_card',
            'signature': 'authorized_signature'
        };

        for (const [field, collectionName] of Object.entries(documentFields)) {
            if (req.files && req.files[field] && req.files[field][0]) {
                const file = req.files[field][0];
                const mediaUuid = generateUUID();
                const originalName = file.originalname.split('.').slice(0, -1).join('.') || field;

                // Delete any existing media for this seller and collection
                await connection.query(`
                    DELETE FROM media 
                    WHERE model_type = 'App\\\\Models\\\\Seller' AND model_id = ? AND collection_name = ?
                `, [id, collectionName]);

                // Insert new media row
                const insertMediaQuery = `
                    INSERT INTO media (
                      model_type, model_id, uuid, collection_name, name, file_name, 
                      mime_type, disk, conversions_disk, size, manipulations, 
                      custom_properties, generated_conversions, responsive_images, 
                      order_column, created_at, updated_at
                    ) VALUES (
                      'App\\\\Models\\\\Seller', ?, ?, ?, ?, ?, 
                      ?, 'local_uploads', 'local_uploads', ?, '[]', 
                      '[]', '[]', '[]', 1, NOW(), NOW()
                    )
                `;

                await connection.query(insertMediaQuery, [
                    id,
                    mediaUuid,
                    collectionName,
                    originalName,
                    file.filename,
                    file.mimetype,
                    file.size
                ]);
            } else {
                // If no new file is uploaded, check if the existing file is kept.
                // If the client didn't send field_existing, it means the user deleted it.
                const existingKey = `${field}_existing`;
                if (!req.body[existingKey]) {
                    await connection.query(`
                        DELETE FROM media 
                        WHERE model_type = 'App\\\\Models\\\\Seller' AND model_id = ? AND collection_name = ?
                    `, [id, collectionName]);
                }
            }
        }

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

const createSeller = async (req, res) => {
    console.log('--- CREATE SELLER REQUEST ---');
    console.log('Body:', req.body);
    const {
        seller,
        email,
        mobile,
        password,
        address,
        city,
        landmark,
        state,
        zipcode,
        country,
        verificationStatus,
        visibilityStatus
    } = req.body;

    if (!seller || !email || !mobile || !password) {
        console.log('Validation failed: missing required fields', { seller, email, mobile, password });
        return res.status(400).json({ success: false, message: 'Seller name, email, mobile, and password are required' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if user already exists
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ? OR mobile = ?', [email, mobile]);
        if (existing.length > 0) {
            console.log('Validation failed: user already exists in DB', { email, mobile });
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'User with this email or mobile number already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let countryCode = '91'; // default to India
        if (country) {
            const [countryRows] = await connection.query('SELECT phonecode FROM countries WHERE name = ?', [country]);
            if (countryRows.length > 0) {
                countryCode = countryRows[0].phonecode;
            }
        }

        // Insert into users
        const [userResult] = await connection.query(`
            INSERT INTO users (name, email, mobile, country_code, password, status, access_panel)
            VALUES (?, ?, ?, ?, ?, 'active', 'seller')
        `, [seller, email, mobile, countryCode, hashedPassword]);

        const userId = userResult.insertId;

        // Insert into sellers
        const [sellerResult] = await connection.query(`
            INSERT INTO sellers (user_id, address, city, landmark, state, zipcode, country, country_code, verification_status, visibility_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            address || '',
            city || '',
            landmark || '',
            state || '',
            zipcode || '',
            country || 'India',
            countryCode,
            verificationStatus || 'approved',
            visibilityStatus || 'visible'
        ]);

        const sellerId = sellerResult.insertId;

        // Save documents
        const documentFields = {
            'license': 'business_license',
            'incorporation': 'articles_of_incorporation',
            'idcard': 'national_identity_card',
            'signature': 'authorized_signature'
        };

        for (const [field, collectionName] of Object.entries(documentFields)) {
            if (req.files && req.files[field] && req.files[field][0]) {
                const file = req.files[field][0];
                const mediaUuid = generateUUID();
                const originalName = file.originalname.split('.').slice(0, -1).join('.') || field;

                const insertMediaQuery = `
                    INSERT INTO media (
                      model_type, model_id, uuid, collection_name, name, file_name, 
                      mime_type, disk, conversions_disk, size, manipulations, 
                      custom_properties, generated_conversions, responsive_images, 
                      order_column, created_at, updated_at
                    ) VALUES (
                      'App\\\\Models\\\\Seller', ?, ?, ?, ?, ?, 
                      ?, 'local_uploads', 'local_uploads', ?, '[]', 
                      '[]', '[]', '[]', 1, NOW(), NOW()
                    )
                `;

                await connection.query(insertMediaQuery, [
                    sellerId,
                    mediaUuid,
                    collectionName,
                    originalName,
                    file.filename,
                    file.mimetype,
                    file.size
                ]);
            }
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Seller created successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating seller:', error);
        res.status(500).json({ success: false, message: 'Failed to create seller: ' + error.message });
    } finally {
        connection.release();
    }
};

const deleteSeller = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM sellers WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Seller not found' });
        }
        res.json({ success: true, message: 'Seller deleted successfully' });
    } catch (error) {
        console.error('Error deleting seller:', error);
        res.status(500).json({ success: false, message: 'Failed to delete seller: ' + error.message });
    }
};

const getSellerWithdrawals = async (req, res) => {
    try {
        const { search } = req.query;
        let queryStr = `
            SELECT 
                w.id,
                w.seller_id,
                w.amount,
                w.status,
                w.request_note,
                w.created_at,
                u.name AS seller_name
            FROM seller_withdrawal_requests w
            LEFT JOIN sellers s ON w.seller_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            WHERE w.status = 'pending'
        `;
        const queryParams = [];

        if (search) {
            queryStr += ` AND (u.name LIKE ? OR w.request_note LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        queryStr += ` ORDER BY w.id DESC`;

        const [rows] = await pool.query(queryStr, queryParams);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching seller withdrawals:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch seller withdrawals: ' + error.message });
    }
};

const getSellerWithdrawalHistory = async (req, res) => {
    try {
        const { search } = req.query;
        let queryStr = `
            SELECT 
                w.id,
                w.seller_id,
                w.amount,
                w.status,
                w.request_note,
                w.admin_remark,
                w.processed_at,
                w.created_at,
                u.name AS seller_name
            FROM seller_withdrawal_requests w
            LEFT JOIN sellers s ON w.seller_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            WHERE w.status IN ('approved', 'rejected')
        `;
        const queryParams = [];

        if (search) {
            queryStr += ` AND (u.name LIKE ? OR w.request_note LIKE ? OR w.admin_remark LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        queryStr += ` ORDER BY w.processed_at DESC, w.id DESC`;

        const [rows] = await pool.query(queryStr, queryParams);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching seller withdrawal history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch seller withdrawal history: ' + error.message });
    }
};

const updateSellerWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_remark } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
        }

        const [existing] = await pool.query('SELECT id, status FROM seller_withdrawal_requests WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Withdrawal request not found' });
        }

        if (existing[0].status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Request is already processed' });
        }

        await pool.query(`
            UPDATE seller_withdrawal_requests 
            SET status = ?, admin_remark = ?, processed_at = NOW(), updated_at = NOW()
            WHERE id = ?
        `, [status, admin_remark || null, id]);

        res.json({ success: true, message: `Withdrawal request status updated to ${status}` });
    } catch (error) {
        console.error('updateSellerWithdrawal error:', error);
        res.status(500).json({ success: false, message: 'Failed to update withdrawal request: ' + error.message });
    }
};

const getSellerSettlements = async (req, res) => {
    try {
        const { store_id, type, search } = req.query;
        let queryStr = `
            SELECT 
                st.id,
                st.seller_id,
                st.order_id,
                st.entry_type,
                st.amount,
                st.description,
                st.posted_at,
                u.name AS seller_name,
                o.order_number
            FROM seller_statements st
            LEFT JOIN sellers s ON st.seller_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN orders o ON st.order_id = o.id
            WHERE st.settlement_status = 'pending'
        `;
        const queryParams = [];

        if (type === 'deduction') {
            queryStr += ` AND st.entry_type = 'debit'`;
        } else {
            queryStr += ` AND st.entry_type = 'credit'`;
        }

        if (store_id) {
            queryStr += ` AND s.id = (SELECT seller_id FROM stores WHERE id = ? LIMIT 1)`;
            queryParams.push(store_id);
        }

        if (search) {
            queryStr += ` AND (u.name LIKE ? OR st.description LIKE ? OR o.order_number LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        queryStr += ` ORDER BY st.id DESC`;

        const [rows] = await pool.query(queryStr, queryParams);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching seller settlements:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settlements: ' + error.message });
    }
};

const getSellerSettlementHistory = async (req, res) => {
    try {
        const { store_id, search } = req.query;
        let queryStr = `
            SELECT 
                st.id,
                st.seller_id,
                st.order_id,
                st.entry_type,
                st.amount,
                st.description,
                st.settled_at,
                st.settlement_reference,
                u.name AS seller_name,
                o.order_number
            FROM seller_statements st
            LEFT JOIN sellers s ON st.seller_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN orders o ON st.order_id = o.id
            WHERE st.settlement_status = 'settled'
        `;
        const queryParams = [];

        if (store_id) {
            queryStr += ` AND s.id = (SELECT seller_id FROM stores WHERE id = ? LIMIT 1)`;
            queryParams.push(store_id);
        }

        if (search) {
            queryStr += ` AND (u.name LIKE ? OR st.description LIKE ? OR st.settlement_reference LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        queryStr += ` ORDER BY st.settled_at DESC, st.id DESC`;

        const [rows] = await pool.query(queryStr, queryParams);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching settlement history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settlement history: ' + error.message });
    }
};

const settleCommissions = async (req, res) => {
    try {
        const { store_id } = req.body;
        let queryStr = `
            UPDATE seller_statements 
            SET settlement_status = 'settled', settled_at = NOW(), settlement_reference = ?
            WHERE settlement_status = 'pending'
        `;
        const reference = 'SETTLE-' + Date.now();
        const queryParams = [reference];

        if (store_id) {
            queryStr += ` AND seller_id = (SELECT seller_id FROM stores WHERE id = ? LIMIT 1)`;
            queryParams.push(store_id);
        }

        const [result] = await pool.query(queryStr, queryParams);
        res.json({ success: true, message: `Successfully settled ${result.affectedRows} commissions.`, reference });
    } catch (error) {
        console.error('Error settling commissions:', error);
        res.status(500).json({ success: false, message: 'Failed to settle commissions: ' + error.message });
    }
};

module.exports = {
    getSellers,
    getSellerById,
    updateSeller,
    createSeller,
    deleteSeller,
    getSellerWithdrawals,
    getSellerWithdrawalHistory,
    updateSellerWithdrawal,
    getSellerSettlements,
    getSellerSettlementHistory,
    settleCommissions
};
