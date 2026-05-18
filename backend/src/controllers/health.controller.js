const { testConnection, query } = require("../config/database");

async function getDatabaseHealth(_req, res) {
  const connection = await testConnection();
  let mediaRows = null;
  try {
    mediaRows = await query("SELECT id, model_id, model_type, file_name, disk, collection_name FROM media WHERE model_type = 'App\\\\Models\\\\Product' LIMIT 5");
  } catch (err) {
    mediaRows = { error: err.message };
  }

  res.json({
    success: true,
    message: "Database connected successfully",
    data: {
        ...connection,
        mediaRows
    },
  });
}

module.exports = {
  getDatabaseHealth,
};
