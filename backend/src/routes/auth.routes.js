const express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { forgotPassword, login } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/forgot-password", asyncHandler(forgotPassword));

module.exports = {
  authRouter,
};
