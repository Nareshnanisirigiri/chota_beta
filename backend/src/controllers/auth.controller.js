const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
const { env } = require("../config/env");
const { HttpError } = require("../utils/http-error");

function normalizeValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return normalizeValue(value).toLowerCase();
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    access_panel: user.access_panel,
    status: user.status,
  };
}

async function login(req, res) {
  const email = normalizeEmail(req.body?.email);
  const mobile = normalizeValue(req.body?.mobile);
  const identifier = normalizeValue(req.body?.identifier);
  const password = normalizeValue(req.body?.password);
  const loginIdentifier = normalizeEmail(identifier || email) || mobile;

  if (!loginIdentifier || !password) {
    throw new HttpError(400, "Email or mobile number and password are required");
  }

  const isEmailLogin = loginIdentifier.includes("@");
  const users = await query(
    `SELECT id, name, email, mobile, access_panel, status, password
     FROM users
     WHERE deleted_at IS NULL
       AND (
         LOWER(email) = ?
         OR mobile = ?
       )
     LIMIT 1`,
    [isEmailLogin ? loginIdentifier : "", isEmailLogin ? "" : loginIdentifier]
  );

  if (users.length === 0) {
    throw new HttpError(401, "Invalid credentials");
  }

  const user = users[0];
  const passwordMatches = await bcrypt.compare(password, user.password || "");

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid credentials");
  }

  if (user.status !== "active") {
    throw new HttpError(403, "Your account is inactive");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      accessPanel: user.access_panel,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
}

async function forgotPassword(req, res) {
  const email = normalizeEmail(req.body?.email);
  const mobile = normalizeValue(req.body?.mobile);
  const identifier = normalizeValue(req.body?.identifier);
  const lookupValue = normalizeEmail(identifier || email) || mobile;

  if (!lookupValue) {
    throw new HttpError(400, "Email or mobile number is required");
  }

  const isEmailLookup = lookupValue.includes("@");
  await query(
    `SELECT id, email
     FROM users
     WHERE deleted_at IS NULL
       AND (
         LOWER(email) = ?
         OR mobile = ?
       )
     LIMIT 1`,
    [isEmailLookup ? lookupValue : "", isEmailLookup ? "" : lookupValue]
  );

  res.json({
    success: true,
    message: "If the account exists, password reset instructions will be sent",
    data: {
      identifier: lookupValue,
    },
  });
}

module.exports = {
  forgotPassword,
  login,
};
