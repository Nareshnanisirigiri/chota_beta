const { pool } = require('../config/database');

const getFAQs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        let whereClauses = [];
        let params = [];

        if (search) {
            whereClauses.push('(question LIKE ? OR answer LIKE ?)');
            const pattern = `%${search}%`;
            params.push(pattern, pattern);
        }

        if (status) {
            whereClauses.push('status = ?');
            params.push(status);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const [countResult] = await pool.query(`SELECT COUNT(*) AS total FROM faqs ${whereSQL}`, params);
        const total = countResult[0].total;

        const [rows] = await pool.query(
            `SELECT * FROM faqs ${whereSQL} ORDER BY id DESC LIMIT ? OFFSET ?`,
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
        console.error('getFAQs error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch FAQs: ' + error.message });
    }
};

const createFAQ = async (req, res) => {
    try {
        const { question, answer, status = 'active' } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ success: false, message: 'Question and answer are required' });
        }

        const query = 'INSERT INTO faqs (question, answer, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
        const [result] = await pool.query(query, [question, answer, status]);

        res.status(201).json({ success: true, message: 'FAQ created successfully', faqId: result.insertId });
    } catch (error) {
        console.error('createFAQ error:', error);
        res.status(500).json({ success: false, message: 'Failed to create FAQ: ' + error.message });
    }
};

const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, status } = req.body;

        const [existing] = await pool.query('SELECT id FROM faqs WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        const query = 'UPDATE faqs SET question = ?, answer = ?, status = ?, updated_at = NOW() WHERE id = ?';
        await pool.query(query, [question, answer, status || 'active', id]);

        res.json({ success: true, message: 'FAQ updated successfully' });
    } catch (error) {
        console.error('updateFAQ error:', error);
        res.status(500).json({ success: false, message: 'Failed to update FAQ: ' + error.message });
    }
};

const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM faqs WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        await pool.query('DELETE FROM faqs WHERE id = ?', [id]);
        res.json({ success: true, message: 'FAQ deleted successfully' });
    } catch (error) {
        console.error('deleteFAQ error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete FAQ: ' + error.message });
    }
};

module.exports = {
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ
};
