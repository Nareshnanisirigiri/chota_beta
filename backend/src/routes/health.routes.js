const express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { getDatabaseHealth } = require("../controllers/health.controller");

const healthRouter = express.Router();

healthRouter.get("/db", asyncHandler(getDatabaseHealth));

module.exports = {
  healthRouter,
};
