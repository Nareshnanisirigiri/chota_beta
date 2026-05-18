const path = require('path');
// Load dotenv using the explicit path to the backend/.env file
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const { query } = require('../backend/src/config/database');

async function run() {
  try {
    console.log("Querying 'stores' table...");
    const stores = await query("SELECT * FROM stores");
    console.log(`Found ${stores.length} stores:`);
    console.log(JSON.stringify(stores, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Error executing query:", err.message);
    process.exit(1);
  }
}

run();
