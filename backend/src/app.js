const express = require("express");
const cors = require("cors");
const path = require("path");

const { env } = require("./config/env");
const { apiRouter } = require("./routes");
const { notFoundHandler } = require("./middleware/not-found");
const { errorHandler } = require("./middleware/error-handler");

const app = express();

const allowedOrigins = [
  "https://chotabeta.vercel.app",
  "https://chotabeta.vercel.app/",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://chotabeta-superadmin-panel.vercel.app/",
  "https://chotabeta-superadmin-panel.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps/postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static uploads
app.use("/Uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", async (_req, res) => {
  try {
    const { query } = require("./config/database");
    const tables = await query("SHOW TABLES");
    const fs = require("fs");
    fs.writeFileSync(path.join(__dirname, "health_tables.json"), JSON.stringify(tables, null, 2));
    res.json({
      success: true,
      message: "Backend server is running",
      tablesCount: tables.length
    });
  } catch (err) {
    res.json({
      success: true,
      message: "Backend server is running but database query failed",
      error: err.message
    });
  }
});

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
};