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
    console.error(
      "Database config:",
      JSON.stringify(
        {
          host: env.dbHost,
          port: env.dbPort,
          database: env.dbName,
          user: env.dbUser,
          ssl: env.dbSsl,
        },
        null,
        2
      )
    );
    console.error(
      "Set Render environment variables for either DATABASE_URL/MYSQL_URL or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME."
    );
    process.exit(1);
  }
}

startServer();
