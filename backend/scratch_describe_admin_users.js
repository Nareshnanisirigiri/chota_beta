const { pool } = require('./src/config/database');

async function run() {
    try {
        const [columns] = await pool.query('DESCRIBE admin_users');
        console.log('ADMIN_USERS COLUMNS:', JSON.stringify(columns, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
run();
