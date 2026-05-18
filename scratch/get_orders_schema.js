const { query } = require("./Backend/src/config/database");

async function run() {
  try {
    const createTable = await query("SHOW CREATE TABLE orders");
    console.log("CREATE TABLE orders:");
    console.log(createTable[0]['Create Table']);
    
    const describeTable = await query("DESCRIBE orders");
    console.log("\nDESCRIBE orders:");
    console.table(describeTable);
    
    process.exit(0);
  } catch (err) {
    console.error("Error fetching schema:", err.message);
    process.exit(1);
  }
}

run();
