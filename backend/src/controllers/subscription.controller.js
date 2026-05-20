const { pool } = require('../config/database');

// GET /api/subscriptions/plans
const getPlans = async (req, res) => {
    try {
        const [plans] = await pool.query("SELECT * FROM subscription_plans ORDER BY id DESC");
        
        // Fetch limits for all plans
        const [limits] = await pool.query("SELECT * FROM subscription_plan_limits");
        
        // Map limits to their plans
        const plansWithLimits = plans.map(plan => {
            const planLimits = limits.filter(l => l.plan_id === plan.id);
            const limitsObj = {};
            planLimits.forEach(l => {
                limitsObj[l.key] = l.value;
            });
            return {
                ...plan,
                limits: limitsObj
            };
        });

        res.json({
            success: true,
            data: plansWithLimits
        });
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch subscription plans: ' + error.message });
    }
};

// POST /api/subscriptions/plans
const createPlan = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const {
            name,
            description,
            price,
            duration_type = 'days',
            duration_days,
            is_free = 0,
            is_default = 0,
            is_recommended = 0,
            status = 1,
            limits = {}
        } = req.body;

        if (!name || duration_days === undefined) {
            return res.status(400).json({ success: false, message: 'Name and duration_days are required' });
        }

        const insertPlanQuery = `
            INSERT INTO subscription_plans (
                name, description, price, duration_type, duration_days, 
                is_free, is_default, is_recommended, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const [planResult] = await connection.query(insertPlanQuery, [
            name,
            description || '',
            price || 0.00,
            duration_type,
            duration_days,
            is_free ? 1 : 0,
            is_default ? 1 : 0,
            is_recommended ? 1 : 0,
            status ? 1 : 0
        ]);

        const planId = planResult.insertId;

        // Insert limits
        const limitKeys = ['store_limit', 'product_limit', 'role_limit', 'system_user_limit', 'variation_product_limit'];
        for (const key of limitKeys) {
            if (limits[key] !== undefined && limits[key] !== null) {
                await connection.query(
                    "INSERT INTO subscription_plan_limits (plan_id, `key`, value, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
                    [planId, key, limits[key]]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Subscription plan created successfully', planId });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating subscription plan:', error);
        res.status(500).json({ success: false, message: 'Failed to create subscription plan: ' + error.message });
    } finally {
        connection.release();
    }
};

// PUT /api/subscriptions/plans/:id
const updatePlan = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const {
            name,
            description,
            price,
            duration_type = 'days',
            duration_days,
            is_free,
            is_default,
            is_recommended,
            status,
            limits = {}
        } = req.body;

        const [existing] = await connection.query("SELECT * FROM subscription_plans WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Subscription plan not found' });
        }

        const updatePlanQuery = `
            UPDATE subscription_plans SET 
                name = ?, description = ?, price = ?, duration_type = ?, duration_days = ?, 
                is_free = ?, is_default = ?, is_recommended = ?, status = ?, updated_at = NOW()
            WHERE id = ?
        `;

        const plan = existing[0];
        await connection.query(updatePlanQuery, [
            name !== undefined ? name : plan.name,
            description !== undefined ? description : plan.description,
            price !== undefined ? price : plan.price,
            duration_type !== undefined ? duration_type : plan.duration_type,
            duration_days !== undefined ? duration_days : plan.duration_days,
            is_free !== undefined ? (is_free ? 1 : 0) : plan.is_free,
            is_default !== undefined ? (is_default ? 1 : 0) : plan.is_default,
            is_recommended !== undefined ? (is_recommended ? 1 : 0) : plan.is_recommended,
            status !== undefined ? (status ? 1 : 0) : plan.status,
            id
        ]);

        if (limits && Object.keys(limits).length > 0) {
            // Delete existing limits
            await connection.query("DELETE FROM subscription_plan_limits WHERE plan_id = ?", [id]);

            // Insert new limits
            const limitKeys = ['store_limit', 'product_limit', 'role_limit', 'system_user_limit', 'variation_product_limit'];
            for (const key of limitKeys) {
                if (limits[key] !== undefined && limits[key] !== null) {
                    await connection.query(
                        "INSERT INTO subscription_plan_limits (plan_id, `key`, value, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
                        [id, key, limits[key]]
                    );
                }
            }
        }

        await connection.commit();
        res.json({ success: true, message: 'Subscription plan updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating subscription plan:', error);
        res.status(500).json({ success: false, message: 'Failed to update subscription plan: ' + error.message });
    } finally {
        connection.release();
    }
};

// DELETE /api/subscriptions/plans/:id
const deletePlan = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query("SELECT * FROM subscription_plans WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Subscription plan not found' });
        }

        // Delete limits first
        await connection.query("DELETE FROM subscription_plan_limits WHERE plan_id = ?", [id]);
        
        // Delete plan
        await connection.query("DELETE FROM subscription_plans WHERE id = ?", [id]);

        await connection.commit();
        res.json({ success: true, message: 'Subscription plan deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting subscription plan:', error);
        res.status(500).json({ success: false, message: 'Failed to delete subscription plan: ' + error.message });
    } finally {
        connection.release();
    }
};

// GET /api/subscriptions/seller-subscriptions
const getSellerSubscriptions = async (req, res) => {
    try {
        const query = `
            SELECT 
                ss.*,
                s.store_name,
                u.name as seller_name,
                u.email as seller_email,
                sp.name as plan_name
            FROM seller_subscriptions ss
            LEFT JOIN sellers s ON ss.seller_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN subscription_plans sp ON ss.plan_id = sp.id
            ORDER BY ss.id DESC
        `;
        const [rows] = await pool.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching seller subscriptions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch seller subscriptions: ' + error.message });
    }
};

// GET /api/subscriptions/transactions
const getTransactions = async (req, res) => {
    try {
        const query = `
            SELECT 
                st.*,
                s.store_name,
                u.name as seller_name,
                u.email as seller_email,
                sp.name as plan_name
            FROM subscription_transactions st
            LEFT JOIN sellers s ON st.seller_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN subscription_plans sp ON st.plan_id = sp.id
            ORDER BY st.id DESC
        `;
        const [rows] = await pool.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching subscription transactions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch transactions: ' + error.message });
    }
};

module.exports = {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
    getSellerSubscriptions,
    getTransactions
};
