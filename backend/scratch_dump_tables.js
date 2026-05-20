const { query } = require("./src/config/database");
const fs = require("fs");
const path = require("path");

async function checkAllTables() {
  try {
    const tables = await query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log("All tables in DB:", tableNames);
    
    // Write table names to file
    fs.writeFileSync(path.join(__dirname, "all_tables.json"), JSON.stringify(tableNames, null, 2));
    
    // Look for tables containing delivery, boy, rider, driver, or cash
    const filtered = tableNames.filter(name => 
      name.includes("delivery") || 
      name.includes("boy") || 
      name.includes("rider") || 
      name.includes("driver") ||
      name.includes("earning") ||
      name.includes("withdrawal") ||
      name.includes("cash")
    );
    console.log("Filtered delivery-related tables:", filtered);
    
    // Describe matching tables
    const descriptions = {};
    for (const table of filtered) {
      try {
        const desc = await query(`DESCRIBE \`${table}\``);
        descriptions[table] = desc;
      } catch (err) {
        descriptions[table] = { error: err.message };
      }
    }
    fs.writeFileSync(path.join(__dirname, "delivery_tables_desc.json"), JSON.stringify(descriptions, null, 2));
    console.log("Descriptions saved to delivery_tables_desc.json");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAllTables();
