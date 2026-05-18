const { query } = require("./src/config/database");

async function checkTables() {
  try {
    const tables = await query("SHOW TABLES");
    console.log("Tables in database:", JSON.stringify(tables, null, 2));
    
    const ordersExist = await query("SHOW TABLES LIKE 'orders'");
    console.log("Orders table check:", JSON.stringify(ordersExist, null, 2));
    
    if (ordersExist.length > 0) {
        const columns = await query("DESCRIBE orders");
        console.log("Orders table columns:", JSON.stringify(columns, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking tables:", error);
    process.exit(1);
  }
}

checkTables();
