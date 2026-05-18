const { pool } = require('../config/database');

// GET /api/product-faqs
const getProductFaqs = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                pf.*,
                p.title AS productTitle
            FROM product_faqs pf
            JOIN products p ON pf.product_id = p.id
            ORDER BY pf.id DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/product-faqs/create
const createProductFaq = async (req, res) => {
    try {
        const { product_id, question, answer, status } = req.body;
        if (!product_id || !question || !answer) {
            return res.status(400).json({ success: false, message: 'product_id, question and answer are required' });
        }
        const faqStatus = status || 'active';
        await pool.query(
            'INSERT INTO product_faqs (product_id, question, answer, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [product_id, question, answer, faqStatus]
        );
        res.status(201).json({ success: true, message: 'Product FAQ created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/product-faqs/:id
const updateProductFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id, question, answer, status } = req.body;
        if (!product_id || !question || !answer || !status) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        await pool.query(
            'UPDATE product_faqs SET product_id = ?, question = ?, answer = ?, status = ?, updated_at = NOW() WHERE id = ?',
            [product_id, question, answer, status, id]
        );
        res.json({ success: true, message: 'Product FAQ updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/product-faqs/:id
const deleteProductFaq = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM product_faqs WHERE id = ?', [id]);
        res.json({ success: true, message: 'Product FAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProductFaqs,
    createProductFaq,
    updateProductFaq,
    deleteProductFaq
};
