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

const dbSource = process.env.DB_SOURCE || (process.env.RENDER === "true" || process.env.DATABASE_URL || process.env.RAILWAY_DATABASE_URL ? "railway" : "local");

const parsedRailwayUrl = parseDatabaseUrl(
  process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL || process.env.MYSQL_URL
);

let dbHost, dbPort, dbUser, dbPassword, dbName;

if (dbSource === "railway") {
  dbHost = parsedRailwayUrl?.dbHost || "ballast.proxy.rlwy.net";
  dbPort = Number(parsedRailwayUrl?.dbPort || 22345);
  dbUser = parsedRailwayUrl?.dbUser || "root";
  dbPassword = parsedRailwayUrl?.dbPassword || "qgiysXerdQpUdJDzzFNygVDODmjXWwre";
  dbName = parsedRailwayUrl?.dbName || "railway";

  // Only allow DB_HOST override if it's not a local address
  if (process.env.DB_HOST && process.env.DB_HOST !== "127.0.0.1" && process.env.DB_HOST !== "localhost") {
    dbHost = process.env.DB_HOST;
    dbPort = Number(process.env.DB_PORT || dbPort);
    dbUser = process.env.DB_USER || dbUser;
    dbPassword = process.env.DB_PASSWORD || dbPassword;
    dbName = process.env.DB_NAME || dbName;
  }
} else {
  dbHost = process.env.DB_HOST || process.env.LOCAL_DB_HOST || "127.0.0.1";
  dbPort = Number(process.env.DB_PORT || process.env.LOCAL_DB_PORT || 3306);
  dbUser = process.env.DB_USER || process.env.LOCAL_DB_USER || "root";
  dbPassword = process.env.DB_PASSWORD || process.env.LOCAL_DB_PASSWORD || "root";
  dbName = process.env.DB_NAME || process.env.LOCAL_DB_NAME || "chota_beta";
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  dbHost,
  dbPort,
  dbUser,
  dbPassword,
  dbName,
  dbSsl:
    process.env.DB_SSL === "true" ||
    process.env.DB_SSL === "1" ||
    parsedRailwayUrl?.dbSsl ||
    false,
  dbConnectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  jwtSecret: process.env.JWT_SECRET || "change-me-mobile-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

module.exports = {
  env,
};
