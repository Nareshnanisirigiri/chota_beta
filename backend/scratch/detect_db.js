const mysql = require("mysql2/promise");

const configurations = [
  { host: "127.0.0.1", port: 3306, user: "root", password: "" },
  { host: "127.0.0.1", port: 3306, user: "root", password: "root" },
  { host: "127.0.0.1", port: 3307, user: "root", password: "" },
  { host: "127.0.0.1", port: 3307, user: "root", password: "root" },
];

async function scan() {
  for (const config of configurations) {
    console.log(`Trying connection: mysql://${config.user}:${config.password ? '***' : ''}@${config.host}:${config.port}...`);
    try {
      const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        connectTimeout: 2000
      });
      console.log(`  Success!`);
      const [rows] = await connection.query("SHOW DATABASES");
      console.log(`  Databases:`, rows.map(r => r.Database || r.DATABASE || Object.values(r)[0]));
      await connection.end();
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }
}

scan().then(() => console.log("Scan complete."));
