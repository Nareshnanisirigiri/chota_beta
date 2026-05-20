const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

function parseDatabaseUrl(connectionString) {
  if (!connectionString) {
    return null;
  }

  try {
    const url = new URL(connectionString);

    return {
      dbHost: url.hostname,
      dbPort: Number(url.port || 3306),
      dbUser: decodeURIComponent(url.username || ""),
      dbPassword: decodeURIComponent(url.password || ""),
      dbName: decodeURIComponent(url.pathname.replace(/^\//, "") || ""),
      dbSsl: process.env.DB_SSL === "true" || process.env.DB_SSL === "1",
    };
  } catch (_error) {
    return null;
  }
}

const parsedDatabaseUrl = parseDatabaseUrl(
  process.env.DATABASE_URL || process.env.MYSQL_URL
);

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  dbHost: process.env.DB_HOST || parsedDatabaseUrl?.dbHost || "127.0.0.1",
  dbPort: Number(process.env.DB_PORT || parsedDatabaseUrl?.dbPort || 3306),
  dbUser: process.env.DB_USER || parsedDatabaseUrl?.dbUser || "root",
  dbPassword:
    process.env.DB_PASSWORD || parsedDatabaseUrl?.dbPassword || "",
  dbName: process.env.DB_NAME || parsedDatabaseUrl?.dbName || "chota_beta",
  dbSsl:
    process.env.DB_SSL === "true" ||
    process.env.DB_SSL === "1" ||
    parsedDatabaseUrl?.dbSsl ||
    false,
  dbConnectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  jwtSecret: process.env.JWT_SECRET || "change-me-mobile-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

module.exports = {
  env,
};
