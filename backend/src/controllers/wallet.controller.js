const { pool } = require('../config/database');

// Ensure database table matches the exact production schema
const ensureTableExists = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS wallet_transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                wallet_id INT NOT NULL,
                user_id INT NOT NULL,
                order_id INT DEFAULT NULL,
                store_id INT DEFAULT NULL,
                transaction_type ENUM('deposit','payment','refund','adjustment') NOT NULL DEFAULT 'deposit',
                payment_method VARCHAR(191) DEFAULT 'system',
                amount DECIMAL(10,2) NOT NULL,
                currency_code VARCHAR(3) NOT NULL DEFAULT 'USD',
                status ENUM('pending','completed','failed','cancelled','refunded','partially_refunded') NOT NULL DEFAULT 'pending',
                transaction_reference VARCHAR(100) DEFAULT NULL,
                description VARCHAR(255) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    } catch (error) {
        console.error('Error ensuring wallet_transactions table exists:', error);
    }
};

const syncWalletBalance = async (walletId) => {
    try {
        const [[depositRes]] = await pool.query(
            "SELECT SUM(amount) as total FROM wallet_transactions WHERE wallet_id = ? AND status = 'completed' AND transaction_type IN ('deposit', 'refund')",
            [walletId]
        );
        const [[withdrawalRes]] = await pool.query(
            "SELECT SUM(amount) as total FROM wallet_transactions WHERE wallet_id = ? AND status = 'completed' AND transaction_type IN ('payment', 'adjustment', 'withdrawal')",
            [walletId]
        );

        const totalDeposits = parseFloat(depositRes.total || 0);
        const totalWithdrawals = parseFloat(withdrawalRes.total || 0);
        const newBalance = totalDeposits - totalWithdrawals;

        await pool.query("UPDATE wallets SET balance = ? WHERE id = ?", [newBalance, walletId]);
        console.log(`Wallet ${walletId} balance synced: ${newBalance}`);
    } catch (e) {
        console.error('Error syncing wallet balance:', e);
    }
};

const getWalletTransactions = async (req, res) => {
    try {
        await ensureTableExists();
        
        // Use a LEFT JOIN to fetch customer name from the users table
        const queryStr = `
            SELECT 
                wt.id,
                wt.wallet_id,
                wt.user_id,
                u.name AS customer_name,
                wt.amount,
                wt.transaction_reference,
                wt.transaction_type,
                wt.status,
                wt.payment_method,
                wt.created_at
            FROM wallet_transactions wt
            LEFT JOIN users u ON wt.user_id = u.id
            ORDER BY wt.id DESC
        `;
        
        const [rows] = await pool.query(queryStr);
        
        // Map table fields to match frontend React state properties
        const formattedRows = rows.map(row => ({
            id: row.id,
            customer: row.customer_name || 'System User / Admin',
            amount: parseFloat(row.amount || 0),
            transactionRef: row.transaction_reference,
            type: row.transaction_type,
            status: row.status ? (row.status.charAt(0).toUpperCase() + row.status.slice(1)) : 'Completed',
            paymentMethod: row.payment_method || 'system',
            createdAt: row.created_at
        }));
        
        res.json({ success: true, data: formattedRows });
    } catch (error) {
        console.error('Error fetching wallet transactions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch wallet transactions: ' + error.message });
    }
};

const createWalletTransaction = async (req, res) => {
    try {
        await ensureTableExists();
        const { customer, amount, transactionRef, type, status, paymentMethod } = req.body;

        if (!customer || amount === undefined || amount === null) {
            return res.status(400).json({ success: false, message: 'Customer and amount are required' });
        }

        // 1. Fetch user_id matching customer name
        let [userRows] = await pool.query('SELECT id FROM users WHERE name = ? LIMIT 1', [customer]);
        let userId = null;
        if (userRows.length > 0) {
            userId = userRows[0].id;
        } else {
            // Find a fallback default user in the system
            const [firstUser] = await pool.query('SELECT id FROM users LIMIT 1');
            if (firstUser.length > 0) {
                userId = firstUser[0].id;
            } else {
                return res.status(400).json({ success: false, message: 'No users found in database to link transaction' });
            }
        }

        // 2. Fetch or create a wallet for this user to ensure referential integrity
        let walletId = null;
        const [walletRows] = await pool.query('SELECT id FROM wallets WHERE user_id = ? LIMIT 1', [userId]);
        if (walletRows.length > 0) {
            walletId = walletRows[0].id;
        } else {
            try {
                const [newWallet] = await pool.query(
                    'INSERT INTO wallets (user_id, balance, created_at, updated_at) VALUES (?, 0, NOW(), NOW())',
                    [userId]
                );
                walletId = newWallet.insertId;
            } catch (e) {
                const [firstWallet] = await pool.query('SELECT id FROM wallets LIMIT 1');
                if (firstWallet.length > 0) {
                    walletId = firstWallet[0].id;
                } else {
                    walletId = 1; // absolute fallback
                }
            }
        }

        // 3. Map type and status safely to match database enums
        const safeType = type === 'withdrawal' ? 'adjustment' : (type || 'deposit');
        const safeStatus = (status || 'completed').toLowerCase();

        const insertQuery = `
            INSERT INTO wallet_transactions 
            (wallet_id, user_id, transaction_type, payment_method, amount, currency_code, status, transaction_reference, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'USD', ?, ?, NOW(), NOW())
        `;

        const [result] = await pool.query(insertQuery, [
            walletId,
            userId,
            safeType,
            paymentMethod || 'system',
            parseFloat(amount),
            safeStatus,
            transactionRef || null
        ]);

        await syncWalletBalance(walletId);

        res.status(201).json({ 
            success: true, 
            message: 'Wallet transaction created successfully', 
            data: { id: result.insertId } 
        });
    } catch (error) {
        console.error('Error creating wallet transaction:', error);
        res.status(500).json({ success: false, message: 'Failed to create wallet transaction: ' + error.message });
    }
};

const updateWalletTransaction = async (req, res) => {
    try {
        await ensureTableExists();
        const { id } = req.params;
        const { customer, amount, transactionRef, type, status, paymentMethod } = req.body;

        if (!customer || amount === undefined || amount === null) {
            return res.status(400).json({ success: false, message: 'Customer and amount are required' });
        }

        // 1. Fetch user_id matching customer name
        let [userRows] = await pool.query('SELECT id FROM users WHERE name = ? LIMIT 1', [customer]);
        let userId = null;
        if (userRows.length > 0) {
            userId = userRows[0].id;
        } else {
            const [firstUser] = await pool.query('SELECT id FROM users LIMIT 1');
            if (firstUser.length > 0) {
                userId = firstUser[0].id;
            } else {
                return res.status(400).json({ success: false, message: 'No users found in database to link transaction' });
            }
        }

        // 2. Fetch or create a wallet for this user
        let walletId = null;
        const [walletRows] = await pool.query('SELECT id FROM wallets WHERE user_id = ? LIMIT 1', [userId]);
        if (walletRows.length > 0) {
            walletId = walletRows[0].id;
        } else {
            try {
                const [newWallet] = await pool.query(
                    'INSERT INTO wallets (user_id, balance, created_at, updated_at) VALUES (?, 0, NOW(), NOW())',
                    [userId]
                );
                walletId = newWallet.insertId;
            } catch (e) {
                const [firstWallet] = await pool.query('SELECT id FROM wallets LIMIT 1');
                if (firstWallet.length > 0) {
                    walletId = firstWallet[0].id;
                } else {
                    walletId = 1;
                }
            }
        }

        // 3. Map type and status safely
        const safeType = type === 'withdrawal' ? 'adjustment' : (type || 'deposit');
        const safeStatus = (status || 'completed').toLowerCase();

        const updateQuery = `
            UPDATE wallet_transactions 
            SET wallet_id = ?, user_id = ?, transaction_type = ?, payment_method = ?, amount = ?, status = ?, transaction_reference = ?, updated_at = NOW()
            WHERE id = ?
        `;

        const [result] = await pool.query(updateQuery, [
            walletId,
            userId,
            safeType,
            paymentMethod || 'system',
            parseFloat(amount),
            safeStatus,
            transactionRef || null,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Wallet transaction not found' });
        }

        await syncWalletBalance(walletId);

        res.json({ success: true, message: 'Wallet transaction updated successfully' });
    } catch (error) {
        console.error('Error updating wallet transaction:', error);
        res.status(500).json({ success: false, message: 'Failed to update wallet transaction: ' + error.message });
    }
};

const deleteWalletTransaction = async (req, res) => {
    try {
        await ensureTableExists();
        const { id } = req.params;

        const [existing] = await pool.query('SELECT wallet_id FROM wallet_transactions WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Wallet transaction not found' });
        }
        const walletId = existing[0].wallet_id;

        const [result] = await pool.query('DELETE FROM wallet_transactions WHERE id = ?', [id]);

        await syncWalletBalance(walletId);

        res.json({ success: true, message: 'Wallet transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting wallet transaction:', error);
        res.status(500).json({ success: false, message: 'Failed to delete wallet transaction: ' + error.message });
    }
};

module.exports = {
    getWalletTransactions,
    createWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction
};
