const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const { apiRouter } = require("./routes");
const { notFoundHandler } = require("./middleware/not-found");
const { errorHandler } = require("./middleware/error-handler");

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: false,
  })
);
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/Uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

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
