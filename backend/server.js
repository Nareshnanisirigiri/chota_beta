const { app } = require("./src/app");
const { env } = require("./src/config/env");
const { testConnection, query } = require("./src/config/database");
const bcrypt = require("bcryptjs");

console.log("DEBUG: RENDER =", process.env.RENDER);
console.log("DEBUG: PORT =", process.env.PORT);
console.log("DEBUG: DB_SOURCE =", process.env.DB_SOURCE);
console.log("DEBUG: env.dbHost =", env.dbHost);

async function startServer() {
  try {
    const connection = await testConnection();
    console.log(`Connected to MySQL database: ${connection.db}`);

    const tables = await query("SHOW TABLES");
    const fs = require("fs");
    const path = require("path");
    fs.writeFileSync(path.join(__dirname, "tables.json"), JSON.stringify(tables, null, 2));
    console.log("DB Tables successfully written to tables.json!");

    console.log("Creating admin_users table if it doesn't exist...");
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        access_panel VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const adminEmail = "experts@chotabeta.com";
    const adminPassword = "Bharath@1985";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await query(`
      INSERT IGNORE INTO admin_users (email, password, status, access_panel)
      VALUES (?, ?, ?, ?)
    `, [adminEmail, hashedPassword, "active", "admin"]);
    
    await query(`
      UPDATE admin_users SET password = ? WHERE email = ?
    `, [hashedPassword, adminEmail]);
    console.log("Admin user seeded successfully.");

    app.listen(env.port, () => {
      console.log(`Backend server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error(
      "Database config:",
      JSON.stringify(
        {
          host: env.dbHost,
          port: env.dbPort,
          database: env.dbName,
          user: env.dbUser,
          ssl: env.dbSsl,
        },
        null,
        2
      )
    );
    console.error(
      "Set Render environment variables for either DATABASE_URL/MYSQL_URL or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME."
    );
    process.exit(1);
  }
}

startServer();
