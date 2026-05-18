const { app } = require("./src/app");
const { env } = require("./src/config/env");
const { testConnection } = require("./src/config/database");

async function startServer() {
  try {
    const connection = await testConnection();
    console.log(`Connected to MySQL database: ${connection.db}`);

    app.listen(env.port, () => {
      console.log(`Backend server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
