const mysql = require("mysql2/promise");

async function run() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: "root",
    password: "",
    database: "chota_beta_live"
  });

  console.log("Connected to chota_beta_live database successfully.");

  // Get tables
  const [tables] = await connection.query("SHOW TABLES");
  console.log(`\nFound ${tables.length} tables in chota_beta_live:\n`);

  for (const tableRow of tables) {
    const tableName = Object.values(tableRow)[0];
    try {
      const [countResult] = await connection.query(`SELECT COUNT(*) AS count FROM \`${tableName}\``);
      const count = countResult[0].count;
      console.log(`- Table: ${tableName.padEnd(35)} | Rows: ${count}`);
    } catch (err) {
      console.log(`- Table: ${tableName.padEnd(35)} | Error: ${err.message}`);
    }
  }

  await connection.end();
}

run().catch(err => {
  console.error("Error running script:", err);
});
