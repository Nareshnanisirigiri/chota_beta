const { pool } = require('../backend/src/config/database');

async function check() {
  try {
    const [columns] = await pool.query("DESCRIBE stores");
    console.log("STORES COLUMNS:");
    console.log(columns.map(c => `${c.Field}: ${c.Type}`).join('\n'));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
