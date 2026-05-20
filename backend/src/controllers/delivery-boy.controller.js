const { pool } = require('../config/database');

// ─── DELIVERY BOYS LIST & MANAGEMENT ──────────────────────────────────────────

const getDeliveryBoys = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            status, 
            verification_status, 
            zone_id 
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = ['db.deleted_at IS NULL'];
        let params = [];

        if (search) {
            whereClauses.push('(db.full_name LIKE ? OR u.email LIKE ? OR u.mobile LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        if (status) {
            whereClauses.push('db.status = ?');
            params.push(status);
        }

        if (verification_status) {
            whereClauses.push('db.verification_status = ?');
            params.push(verification_status);
        }

        if (zone_id) {
            whereClauses.push('db.delivery_zone_id = ?');
            params.push(zone_id);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Query total count
        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM delivery_boys db
            JOIN users u ON db.user_id = u.id
            LEFT JOIN delivery_zones dz ON db.delivery_zone_id = dz.id
            ${whereSQL}
        `;
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;

        // Query paginated rows
        const selectQuery = `
            SELECT db.*, u.email, u.mobile, dz.name AS delivery_zone_name 
            FROM delivery_boys db
            JOIN users u ON db.user_id = u.id
            LEFT JOIN delivery_zones dz ON db.delivery_zone_id = dz.id
            ${whereSQL}
            ORDER BY db.id DESC
            LIMIT ? OFFSET ?
        `;
        
        // Append limit/offset params (using mysql2, limit/offset can be passed as numbers or strings in array if prepared, but to be safe we bind them)
        const queryParams = [...params, parsedLimit, offset];
        const [rows] = await pool.query(selectQuery, queryParams);

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
        console.error('getDeliveryBoys error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch delivery boys: ' + error.message });
    }
};

const getDeliveryZones = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, name FROM delivery_zones WHERE status = 'active' ORDER BY name ASC"
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getDeliveryZones error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch delivery zones: ' + error.message });
    }
};

const getDeliveryBoyById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.query(`
            SELECT db.*, u.email, u.mobile, dz.name AS delivery_zone_name 
            FROM delivery_boys db
            JOIN users u ON db.user_id = u.id
            LEFT JOIN delivery_zones dz ON db.delivery_zone_id = dz.id
            WHERE db.id = ? AND db.deleted_at IS NULL
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Delivery boy not found' });
        }

        const deliveryBoy = rows[0];

        // Fetch orders count
        const [statsResult] = await pool.query(`
            SELECT 
              COUNT(*) AS total_orders,
              SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_orders
            FROM delivery_boy_assignments
            WHERE delivery_boy_id = ?
        `, [id]);

        // Fetch rating
        const [ratingResult] = await pool.query(`
            SELECT AVG(rating) AS average_rating
            FROM delivery_feedback
            WHERE delivery_boy_id = ?
        `, [id]);

        deliveryBoy.total_orders = statsResult[0].total_orders || 0;
        deliveryBoy.completed_orders = statsResult[0].completed_orders || 0;
        deliveryBoy.average_rating = ratingResult[0].average_rating ? parseFloat(Number(ratingResult[0].average_rating).toFixed(1)) : 0;

        res.json({ success: true, data: deliveryBoy });
    } catch (error) {
        console.error('getDeliveryBoyById error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch delivery boy details: ' + error.message });
    }
};

const updateVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { verification_status, verification_remark } = req.body;

        if (!['pending', 'rejected', 'verified'].includes(verification_status)) {
            return res.status(400).json({ success: false, message: 'Invalid verification status value' });
        }

        const [existing] = await pool.query('SELECT id FROM delivery_boys WHERE id = ? AND deleted_at IS NULL', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Delivery boy not found' });
        }

        await pool.query(`
            UPDATE delivery_boys 
            SET verification_status = ?, verification_remark = ?, updated_at = NOW() 
            WHERE id = ?
        `, [verification_status, verification_remark || null, id]);

        res.json({ success: true, message: 'Verification status updated successfully' });
    } catch (error) {
        console.error('updateVerification error:', error);
        res.status(500).json({ success: false, message: 'Failed to update verification status: ' + error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const [existing] = await pool.query('SELECT id FROM delivery_boys WHERE id = ? AND deleted_at IS NULL', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Delivery boy not found' });
        }

        await pool.query(`
            UPDATE delivery_boys 
            SET status = ?, updated_at = NOW() 
            WHERE id = ?
        `, [status, id]);

        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error('updateStatus error:', error);
        res.status(500).json({ success: false, message: 'Failed to update status: ' + error.message });
    }
};

const deleteDeliveryBoy = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM delivery_boys WHERE id = ? AND deleted_at IS NULL', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Delivery boy not found' });
        }

        // Soft delete
        await pool.query('UPDATE delivery_boys SET deleted_at = NOW() WHERE id = ?', [id]);
        res.json({ success: true, message: 'Delivery boy deleted successfully' });
    } catch (error) {
        console.error('deleteDeliveryBoy error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete delivery boy: ' + error.message });
    }
};

// ─── EARNINGS ─────────────────────────────────────────────────────────────────

const getEarnings = async (req, res) => {
    try {
        const { delivery_boy_id, search = '' } = req.query;
        let whereClauses = ["dba.payment_status = 'pending'", "dba.status = 'completed'"];
        let params = [];

        if (delivery_boy_id) {
            whereClauses.push('dba.delivery_boy_id = ?');
            params.push(delivery_boy_id);
        }

        if (search) {
            whereClauses.push('(db.full_name LIKE ? OR dba.order_id LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT dba.id, dba.order_id, db.full_name AS delivery_boy_name, dba.status, dba.total_earnings, dba.payment_status, dba.created_at
            FROM delivery_boy_assignments dba
            JOIN delivery_boys db ON dba.delivery_boy_id = db.id
            ${whereSQL}
            ORDER BY dba.id DESC
        `, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getEarnings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending earnings: ' + error.message });
    }
};

const getEarningHistory = async (req, res) => {
    try {
        const { delivery_boy_id, search = '' } = req.query;
        let whereClauses = ["dba.payment_status = 'paid'"];
        let params = [];

        if (delivery_boy_id) {
            whereClauses.push('dba.delivery_boy_id = ?');
            params.push(delivery_boy_id);
        }

        if (search) {
            whereClauses.push('(db.full_name LIKE ? OR dba.order_id LIKE ? OR dba.transaction_id LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT dba.id, dba.order_id, db.full_name AS delivery_boy_name, dba.total_earnings, dba.payment_status, dba.paid_at, dba.transaction_id
            FROM delivery_boy_assignments dba
            JOIN delivery_boys db ON dba.delivery_boy_id = db.id
            ${whereSQL}
            ORDER BY dba.paid_at DESC
        `, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getEarningHistory error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch earning history: ' + error.message });
    }
};

const settleEarning = async (req, res) => {
    try {
        const { id } = req.params;
        const { transaction_id } = req.body;

        const [existing] = await pool.query('SELECT id, payment_status FROM delivery_boy_assignments WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        if (existing[0].payment_status === 'paid') {
            return res.status(400).json({ success: false, message: 'Earning is already paid' });
        }

        await pool.query(`
            UPDATE delivery_boy_assignments 
            SET payment_status = 'paid', paid_at = NOW(), transaction_id = ? 
            WHERE id = ?
        `, [transaction_id || null, id]);

        res.json({ success: true, message: 'Payment settled successfully' });
    } catch (error) {
        console.error('settleEarning error:', error);
        res.status(500).json({ success: false, message: 'Failed to settle payment: ' + error.message });
    }
};

// ─── CASH COLLECTIONS ─────────────────────────────────────────────────────────

const getCashCollections = async (req, res) => {
    try {
        const { delivery_boy_id, search = '' } = req.query;
        // Cash collected > cash submitted, statuscompleted/in_progress, or pending submissions
        let whereClauses = ["dba.cod_cash_collected > dba.cod_cash_submitted", "dba.cod_submission_status != 'submitted'"];
        let params = [];

        if (delivery_boy_id) {
            whereClauses.push('dba.delivery_boy_id = ?');
            params.push(delivery_boy_id);
        }

        if (search) {
            whereClauses.push('(db.full_name LIKE ? OR dba.order_id LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT 
              dba.id, 
              dba.order_id, 
              db.full_name AS delivery_boy_name, 
              dba.status, 
              dba.cod_cash_collected, 
              dba.cod_cash_submitted, 
              (dba.cod_cash_collected - dba.cod_cash_submitted) AS cash_remaining,
              dba.cod_submission_status, 
              dba.created_at
            FROM delivery_boy_assignments dba
            JOIN delivery_boys db ON dba.delivery_boy_id = db.id
            ${whereSQL}
            ORDER BY dba.id DESC
        `, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getCashCollections error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending cash collections: ' + error.message });
    }
};

const getCashCollectionHistory = async (req, res) => {
    try {
        const { delivery_boy_id, search = '' } = req.query;
        let whereClauses = ["dbct.transaction_type = 'submitted'"];
        let params = [];

        if (delivery_boy_id) {
            whereClauses.push('dbct.delivery_boy_id = ?');
            params.push(delivery_boy_id);
        }

        if (search) {
            whereClauses.push('(db.full_name LIKE ? OR dbct.order_id LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT 
              dbct.id, 
              dbct.order_id, 
              db.full_name AS delivery_boy_name, 
              dbct.amount AS cash_submitted, 
              dba.cod_cash_collected AS cash_collected,
              dba.cod_submission_status AS submission_status,
              dbct.transaction_date AS submitted_at
            FROM delivery_boy_cash_transactions dbct
            JOIN delivery_boys db ON dbct.delivery_boy_id = db.id
            LEFT JOIN delivery_boy_assignments dba ON dbct.delivery_boy_assignment_id = dba.id
            ${whereSQL}
            ORDER BY dbct.id DESC
        `, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getCashCollectionHistory error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch cash submission history: ' + error.message });
    }
};

const submitCash = async (req, res) => {
    try {
        const { assignment_id, amount } = req.body;

        if (!assignment_id || !amount || parseFloat(amount) <= 0) {
            return res.status(400).json({ success: false, message: 'Assignment ID and valid positive amount are required' });
        }

        const [existing] = await pool.query(`
            SELECT id, order_id, delivery_boy_id, cod_cash_collected, cod_cash_submitted 
            FROM delivery_boy_assignments 
            WHERE id = ?
        `, [assignment_id]);

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        const assignment = existing[0];
        const collectAmt = parseFloat(assignment.cod_cash_collected);
        const submitAmt = parseFloat(assignment.cod_cash_submitted);
        const subAmount = parseFloat(amount);
        
        if (submitAmt + subAmount > collectAmt) {
            return res.status(400).json({ 
                success: false, 
                message: `Submitted amount exceeds remaining collected cash. Max allowed: ${collectAmt - submitAmt}` 
            });
        }

        const newSubmitted = submitAmt + subAmount;
        const newStatus = newSubmitted >= collectAmt ? 'submitted' : 'partially_submitted';

        // 1. Insert cash transaction
        await pool.query(`
            INSERT INTO delivery_boy_cash_transactions 
              (delivery_boy_assignment_id, order_id, delivery_boy_id, amount, transaction_type, transaction_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'submitted', NOW(), NOW(), NOW())
        `, [assignment_id, assignment.order_id, assignment.delivery_boy_id, subAmount]);

        // 2. Update assignment status
        await pool.query(`
            UPDATE delivery_boy_assignments 
            SET cod_cash_submitted = ?, cod_submission_status = ?, updated_at = NOW()
            WHERE id = ?
        `, [newSubmitted, newStatus, assignment_id]);

        res.json({ success: true, message: 'Cash submitted successfully' });
    } catch (error) {
        console.error('submitCash error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit cash: ' + error.message });
    }
};

// ─── WITHDRAWALS ──────────────────────────────────────────────────────────────

const getWithdrawals = async (req, res) => {
    try {
        const { delivery_boy_id, search = '' } = req.query;
        let whereClauses = ["dbwr.status = 'pending'"];
        let params = [];

        if (delivery_boy_id) {
            whereClauses.push('dbwr.delivery_boy_id = ?');
            params.push(delivery_boy_id);
        }

        if (search) {
            whereClauses.push('(db.full_name LIKE ? OR dbwr.request_note LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT dbwr.*, db.full_name AS delivery_boy_name
            FROM delivery_boy_withdrawal_requests dbwr
            JOIN delivery_boys db ON dbwr.delivery_boy_id = db.id
            ${whereSQL}
            ORDER BY dbwr.id DESC
        `, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getWithdrawals error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending withdrawals: ' + error.message });
    }
};

const getWithdrawalHistory = async (req, res) => {
    try {
        const { delivery_boy_id, search = '' } = req.query;
        let whereClauses = ["dbwr.status != 'pending'"];
        let params = [];

        if (delivery_boy_id) {
            whereClauses.push('dbwr.delivery_boy_id = ?');
            params.push(delivery_boy_id);
        }

        if (search) {
            whereClauses.push('(db.full_name LIKE ? OR dbwr.request_note LIKE ? OR dbwr.admin_remark LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT dbwr.*, db.full_name AS delivery_boy_name
            FROM delivery_boy_withdrawal_requests dbwr
            JOIN delivery_boys db ON dbwr.delivery_boy_id = db.id
            ${whereSQL}
            ORDER BY dbwr.processed_at DESC
        `, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getWithdrawalHistory error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch withdrawal history: ' + error.message });
    }
};

const updateWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_remark } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
        }

        const [existing] = await pool.query('SELECT id, status FROM delivery_boy_withdrawal_requests WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Withdrawal request not found' });
        }

        if (existing[0].status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Request is already processed' });
        }

        await pool.query(`
            UPDATE delivery_boy_withdrawal_requests 
            SET status = ?, admin_remark = ?, processed_at = NOW(), updated_at = NOW()
            WHERE id = ?
        `, [status, admin_remark || null, id]);

        res.json({ success: true, message: `Withdrawal request status updated to ${status}` });
    } catch (error) {
        console.error('updateWithdrawal error:', error);
        res.status(500).json({ success: false, message: 'Failed to update withdrawal request: ' + error.message });
    }
};

module.exports = {
    getDeliveryBoys,
    getDeliveryZones,
    getDeliveryBoyById,
    updateVerification,
    updateStatus,
    deleteDeliveryBoy,
    getEarnings,
    getEarningHistory,
    settleEarning,
    getCashCollections,
    getCashCollectionHistory,
    submitCash,
    getWithdrawals,
    getWithdrawalHistory,
    updateWithdrawal
};
