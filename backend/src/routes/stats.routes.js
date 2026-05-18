const express = require("express");
const { getStats } = require("../controllers/stats.controller");

const statsRouter = express.Router();

statsRouter.get("/", getStats);

module.exports = {
  statsRouter,
};
