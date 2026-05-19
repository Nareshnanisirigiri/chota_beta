const express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { forgotPassword, login, adminLogin, adminRegister } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/admin-login", asyncHandler(adminLogin));
authRouter.post("/admin-register", asyncHandler(adminRegister));
authRouter.post("/forgot-password", asyncHandler(forgotPassword));

module.exports = {
  authRouter,
};
