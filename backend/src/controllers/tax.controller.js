const { pool } = require('../config/database');

// ─── TAX RATES ────────────────────────────────────────────────────────────────

const getTaxRates = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM chota_beta.tax_rates ORDER BY id ASC'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getTaxRates error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tax rates: ' + error.message });
    }
};

const createTaxRate = async (req, res) => {
    try {
        const { title, rate } = req.body;
        if (!title || rate === undefined || rate === null || rate === '') {
            return res.status(400).json({ success: false, message: 'Title and rate are required' });
        }
        const numRate = parseFloat(rate);
        if (isNaN(numRate)) {
            return res.status(400).json({ success: false, message: 'Rate must be a valid number' });
        }
        await pool.query(
            'INSERT INTO chota_beta.tax_rates (title, rate, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [title.trim(), numRate]
        );
        res.status(201).json({ success: true, message: 'Tax rate created successfully' });
    } catch (error) {
        console.error('createTaxRate error:', error);
        res.status(500).json({ success: false, message: 'Failed to create tax rate: ' + error.message });
    }
};

const updateTaxRate = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, rate } = req.body;
        if (!title || rate === undefined || rate === null || rate === '') {
            return res.status(400).json({ success: false, message: 'Title and rate are required' });
        }
        const numRate = parseFloat(rate);
        if (isNaN(numRate)) {
            return res.status(400).json({ success: false, message: 'Rate must be a valid number' });
        }
        const [existing] = await pool.query('SELECT id FROM chota_beta.tax_rates WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Tax rate not found' });
        }
        await pool.query(
            'UPDATE chota_beta.tax_rates SET title = ?, rate = ?, updated_at = NOW() WHERE id = ?',
            [title.trim(), numRate, id]
        );
        res.json({ success: true, message: 'Tax rate updated successfully' });
    } catch (error) {
        console.error('updateTaxRate error:', error);
        res.status(500).json({ success: false, message: 'Failed to update tax rate: ' + error.message });
    }
};

const deleteTaxRate = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT id FROM chota_beta.tax_rates WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Tax rate not found' });
        }
        await pool.query('DELETE FROM chota_beta.tax_rates WHERE id = ?', [id]);
        res.json({ success: true, message: 'Tax rate deleted successfully' });
    } catch (error) {
        console.error('deleteTaxRate error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete tax rate: ' + error.message });
    }
};

// ─── TAX CLASSES ──────────────────────────────────────────────────────────────

const getTaxClasses = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM chota_beta.tax_classes WHERE deleted_at IS NULL ORDER BY id ASC'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('getTaxClasses error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tax classes: ' + error.message });
    }
};

const createTaxClass = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }
        await pool.query(
            'INSERT INTO chota_beta.tax_classes (title, created_at, updated_at) VALUES (?, NOW(), NOW())',
            [title.trim()]
        );
        res.status(201).json({ success: true, message: 'Tax class created successfully' });
    } catch (error) {
        console.error('createTaxClass error:', error);
        res.status(500).json({ success: false, message: 'Failed to create tax class: ' + error.message });
    }
};

const updateTaxClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }
        const [existing] = await pool.query(
            'SELECT id FROM chota_beta.tax_classes WHERE id = ? AND deleted_at IS NULL', [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Tax class not found' });
        }
        await pool.query(
            'UPDATE chota_beta.tax_classes SET title = ?, updated_at = NOW() WHERE id = ?',
            [title.trim(), id]
        );
        res.json({ success: true, message: 'Tax class updated successfully' });
    } catch (error) {
        console.error('updateTaxClass error:', error);
        res.status(500).json({ success: false, message: 'Failed to update tax class: ' + error.message });
    }
};

const deleteTaxClass = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query(
            'SELECT id FROM chota_beta.tax_classes WHERE id = ? AND deleted_at IS NULL', [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Tax class not found' });
        }
        // Soft delete
        await pool.query(
            'UPDATE chota_beta.tax_classes SET deleted_at = NOW() WHERE id = ?', [id]
        );
        res.json({ success: true, message: 'Tax class deleted successfully' });
    } catch (error) {
        console.error('deleteTaxClass error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete tax class: ' + error.message });
    }
};

module.exports = {
    getTaxRates,
    createTaxRate,
    updateTaxRate,
    deleteTaxRate,
    getTaxClasses,
    createTaxClass,
    updateTaxClass,
    deleteTaxClass,
};
