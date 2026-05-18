const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  dbHost: process.env.DB_HOST || "127.0.0.1",
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "chota_beta",
  dbConnectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  jwtSecret: process.env.JWT_SECRET || "change-me-mobile-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

module.exports = {
  env,
};
