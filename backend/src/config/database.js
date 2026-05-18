const mysql = require("mysql2/promise");
const { env } = require("./env");

const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  ssl: env.dbSsl ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: env.dbConnectionLimit,
  queueLimit: 0,
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function testConnection() {
  const rows = await query("SELECT DATABASE() AS db, NOW() AS connected_at");
  return rows[0];
}

module.exports = {
  pool,
  query,
  testConnection,
};
