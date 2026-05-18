const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const { query } = require('../backend/src/config/database');
const fs = require('fs');

async function run() {
  try {
    console.log("Querying database 'products' table...");
    const products = await query("SELECT * FROM products LIMIT 50");
    console.log(`Found ${products.length} products in database.`);
    
    // Save output to scratch directory
    const outputPath = path.join(__dirname, 'products_output.json');
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
    console.log(`Successfully saved products data to: ${outputPath}`);
    
    if (products.length > 0) {
      console.log("\nSample Product Columns:", Object.keys(products[0]));
      console.log("\nSample Product 1 Details:", JSON.stringify(products[0], null, 2));
    } else {
      console.log("\nWarning: The 'products' table is currently empty.");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Error executing query:", err.message);
    process.exit(1);
  }
}

run();
