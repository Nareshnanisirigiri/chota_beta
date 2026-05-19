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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/Uploads", express.static(path.join(__dirname, "../../uploads")));
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend server is running",
  });
});

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
};