const { pool } = require('../config/database');

const getRoles = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = [];
        let params = [];

        if (search) {
            whereClauses.push('name LIKE ?');
            params.push(`%${search}%`);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [countResult] = await pool.query(`SELECT COUNT(*) AS total FROM roles ${whereSQL}`, params);
        const total = countResult[0].total;

        const [rows] = await pool.query(
            `SELECT id, name, guard_name AS guardName, created_at AS createdAt FROM roles ${whereSQL} ORDER BY id DESC LIMIT ? OFFSET ?`,
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
        console.error('getRoles error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch roles: ' + error.message });
    }
};

const createRole = async (req, res) => {
    try {
        const { name, guardName = 'admin' } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Role designation name is required' });
        }

        const [result] = await pool.query(
            'INSERT INTO roles (name, guard_name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [name, guardName]
        );

        res.status(201).json({ success: true, message: 'Role created successfully', roleId: result.insertId });
    } catch (error) {
        console.error('createRole error:', error);
        res.status(500).json({ success: false, message: 'Failed to create role: ' + error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, guardName = 'admin' } = req.body;

        const [existing] = await pool.query('SELECT id FROM roles WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        await pool.query(
            'UPDATE roles SET name = ?, guard_name = ?, updated_at = NOW() WHERE id = ?',
            [name, guardName, id]
        );

        res.json({ success: true, message: 'Role updated successfully' });
    } catch (error) {
        console.error('updateRole error:', error);
        res.status(500).json({ success: false, message: 'Failed to update role: ' + error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM roles WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        await pool.query('DELETE FROM roles WHERE id = ?', [id]);
        res.json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
        console.error('deleteRole error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete role: ' + error.message });
    }
};

module.exports = {
    getRoles,
    createRole,
    updateRole,
    deleteRole
};
