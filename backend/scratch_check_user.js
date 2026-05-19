const mysql = require("mysql2/promise");

async function checkUser() {
  try {
    const connection = await mysql.createConnection("mysql://root:qgiysXerdQpUdJDzzFNygVDODmjXWwre@ballast.proxy.rlwy.net:22345/railway");
    console.log("Connected to db");
    const [rows] = await connection.execute("SELECT id, email, mobile, status, password FROM users WHERE email='experts@chotabeta.com'");
    console.log("Users:", rows);
    const [admins] = await connection.execute("SELECT * FROM admin_users WHERE email='experts@chotabeta.com'").catch(() => [[]]);
    console.log("Admins:", admins);
    connection.end();
  } catch (err) {
    console.error(err);
  }
}
checkUser();
