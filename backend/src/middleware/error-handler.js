function errorHandler(error, _req, res, _next) {
  console.error(error);

  res.status(error.statusCode || error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(error.details ? { errors: error.details } : {}),
  });
}

module.exports = {
  errorHandler,
};
