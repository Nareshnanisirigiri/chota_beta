const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const ensureColumnsExist = async () => {
    try {
        const [columns] = await pool.query('DESCRIBE admin_users');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('name')) {
            await pool.query('ALTER TABLE admin_users ADD COLUMN name VARCHAR(255) NULL');
        }
        if (!columnNames.includes('mobile')) {
            await pool.query('ALTER TABLE admin_users ADD COLUMN mobile VARCHAR(20) NULL');
        }
        if (!columnNames.includes('role')) {
            await pool.query('ALTER TABLE admin_users ADD COLUMN role VARCHAR(100) NULL');
        }
    } catch (err) {
        console.error('Error ensuring admin_users columns exist:', err);
    }
};

const getAdminUsers = async (req, res) => {
    try {
        await ensureColumnsExist();

        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = [];
        let params = [];

        if (search) {
            whereClauses.push('(email LIKE ? OR name LIKE ? OR mobile LIKE ? OR role LIKE ?)');
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam, searchParam);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [countResult] = await pool.query(`SELECT COUNT(*) AS total FROM admin_users ${whereSQL}`, params);
        const total = countResult[0].total;

        const [rows] = await pool.query(
            `SELECT id, email, status, access_panel, name, mobile, role, created_at AS createdAt FROM admin_users ${whereSQL} ORDER BY id DESC LIMIT ? OFFSET ?`,
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
        console.error('getAdminUsers error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin users: ' + error.message });
    }
};

const createAdminUser = async (req, res) => {
    try {
        await ensureColumnsExist();

        const { email, password, status = 'active', access_panel = 'admin', name, mobile, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Check if email already exists
        const [existing] = await pool.query('SELECT id FROM admin_users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO admin_users (email, password, status, access_panel, name, mobile, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [email, hashedPassword, status, access_panel, name || null, mobile || null, role || null]
        );

        res.status(201).json({ success: true, message: 'System user initialized successfully', userId: result.insertId });
    } catch (error) {
        console.error('createAdminUser error:', error);
        res.status(500).json({ success: false, message: 'Failed to create system user: ' + error.message });
    }
};

const updateAdminUser = async (req, res) => {
    try {
        await ensureColumnsExist();

        const { id } = req.params;
        const { email, password, status, name, mobile, role } = req.body;

        const [existing] = await pool.query('SELECT id, password FROM admin_users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let queryStr = 'UPDATE admin_users SET email = ?, status = ?, name = ?, mobile = ?, role = ?, updated_at = NOW()';
        let params = [email, status || 'active', name || null, mobile || null, role || null];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            queryStr = 'UPDATE admin_users SET email = ?, password = ?, status = ?, name = ?, mobile = ?, role = ?, updated_at = NOW()';
            params = [email, hashedPassword, status || 'active', name || null, mobile || null, role || null];
        }

        params.push(id);
        await pool.query(`${queryStr} WHERE id = ?`, params);

        res.json({ success: true, message: 'System user updated successfully' });
    } catch (error) {
        console.error('updateAdminUser error:', error);
        res.status(500).json({ success: false, message: 'Failed to update system user: ' + error.message });
    }
};

const deleteAdminUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM admin_users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await pool.query('DELETE FROM admin_users WHERE id = ?', [id]);
        res.json({ success: true, message: 'System user deleted successfully' });
    } catch (error) {
        console.error('deleteAdminUser error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete system user: ' + error.message });
    }
};

module.exports = {
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser
};
