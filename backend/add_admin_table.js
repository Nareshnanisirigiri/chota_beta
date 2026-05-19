const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function createAdminTable() {
  try {
    console.log("Connecting to Railway database...");
    
    // Connect using Railway DB URL directly
    const connection = await mysql.createConnection(
      "mysql://root:qgiysXerdQpUdJDzzFNygVDODmjXWwre@ballast.proxy.rlwy.net:22345/railway"
    );

    console.log("Creating admin_users table if it doesn't exist...");
    await connection.execute(`
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
    console.log("Table admin_users verified.");

    const adminEmail = "experts@chotabeta.com";
    const adminPassword = "Bharath@1985";
    
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    console.log(`Inserting admin user ${adminEmail}...`);
    await connection.execute(`
      INSERT IGNORE INTO admin_users (email, password, status, access_panel)
      VALUES (?, ?, ?, ?)
    `, [adminEmail, hashedPassword, "active", "admin"]);

    // Update if it already exists
    await connection.execute(`
      UPDATE admin_users SET password = ? WHERE email = ?
    `, [hashedPassword, adminEmail]);

    console.log("Admin user inserted/updated successfully!");

    await connection.end();
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

createAdminTable();
