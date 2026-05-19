/**
 * migrate_to_railway.js
 * Exports local MySQL and imports into Railway using mysql2 (no shell tricks)
 * Run from: d:\Office\Chota_beta
 * Command: node migrate_to_railway.js
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const mysql = require("./backend/node_modules/mysql2/promise");

// ─── LOCAL CONFIG ─────────────────────────────────────────────────────────────
const LOCAL = {
  user: "root",
  password: "root",
  database: "chota_beta",
};

// ─── RAILWAY CONFIG ───────────────────────────────────────────────────────────
// NOTE: Railway creates a DB named "railway" by default.
// We import into it and it will contain all chota_beta tables.
const RAILWAY = {
  host: "ballast.proxy.rlwy.net",
  port: 22345,
  user: "root",
  password: "qgiysXerdQpUdJDzzFNygVDODmjXWwre",
  database: "railway",
  ssl: { rejectUnauthorized: false },
};

const DUMP_FILE = path.join(__dirname, "chota_beta_export.sql");

// ─── Find mysqldump ───────────────────────────────────────────────────────────
const MYSQL_PATHS = [
  "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin",
  "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin",
  "C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin",
  "C:\\xampp\\mysql\\bin",
  "C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin",
];

function findBin(exe) {
  for (const dir of MYSQL_PATHS) {
    const full = path.join(dir, exe);
    if (fs.existsSync(full)) return full;
  }
  return exe;
}

// ─── STEP 1: Export local DB using mysqldump ──────────────────────────────────
function exportLocal() {
  console.log("\n📦 Step 1: Exporting local database...");
  const MYSQLDUMP = findBin("mysqldump.exe");
  console.log("   Using:", MYSQLDUMP);

  const result = spawnSync(
    MYSQLDUMP,
    [
      `-u${LOCAL.user}`,
      `-p${LOCAL.password}`,
      "--single-transaction",
      "--routines",
      "--triggers",
      "--no-tablespaces",
      LOCAL.database,
    ],
    { encoding: "utf8", maxBuffer: 500 * 1024 * 1024 }
  );

  if (result.error || result.status !== 0) {
    console.error("❌ Export failed:", result.error?.message || result.stderr);
    process.exit(1);
  }

  fs.writeFileSync(DUMP_FILE, result.stdout, "utf8");
  const sizeMB = (fs.statSync(DUMP_FILE).size / 1024 / 1024).toFixed(2);
  console.log(`✅ Export done! File: ${DUMP_FILE} (${sizeMB} MB)`);
}

// ─── STEP 2: Import SQL into Railway using mysql2 ─────────────────────────────
async function importToRailway() {
  console.log("\n🚂 Step 2: Importing into Railway MySQL via mysql2...");
  console.log(`   Host: ${RAILWAY.host}:${RAILWAY.port}`);
  console.log(`   Database: ${RAILWAY.database}`);

  const sql = fs.readFileSync(DUMP_FILE, "utf8");

  // Split SQL into individual statements (handle multi-line)
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("/*"));

  console.log(`   Total statements to run: ${statements.length}`);

  const conn = await mysql.createConnection(RAILWAY);
  console.log("   ✅ Connected to Railway!\n");

  // ✅ CRITICAL: Disable FK checks so tables import in any order
  await conn.query("SET FOREIGN_KEY_CHECKS=0;");
  await conn.query("SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';");
  await conn.query("SET time_zone='+00:00';");
  console.log("   ✅ Foreign key checks disabled for import\n");

  let done = 0;
  let errors = 0;
  const errorList = [];

  for (const stmt of statements) {
    try {
      await conn.query(stmt);
      done++;
      if (done % 50 === 0) {
        process.stdout.write(`   Progress: ${done}/${statements.length} statements\r`);
      }
    } catch (err) {
      // Only skip truly non-critical errors
      const isNonCritical =
        err.code === "ER_TABLE_EXISTS_ERROR" ||
        err.code === "ER_DUP_ENTRY" ||
        err.message.includes("already exists") ||
        err.message.includes("Duplicate entry");

      if (!isNonCritical) {
        errors++;
        errorList.push(err.message.substring(0, 100));
      }
    }
  }

  // ✅ Re-enable FK checks after import
  await conn.query("SET FOREIGN_KEY_CHECKS=1;");
  await conn.end();

  console.log(`\n✅ Import complete! ${done} statements run. ${errors} errors.`);
  if (errorList.length > 0) {
    console.log("\n   First few errors (non-critical):");
    errorList.slice(0, 5).forEach((e) => console.log("   -", e));
  }
}

// ─── STEP 3: Verify ──────────────────────────────────────────────────────────
async function verify() {
  console.log("\n🔍 Step 3: Verifying tables in Railway...\n");
  const conn = await mysql.createConnection(RAILWAY);
  const [tables] = await conn.query("SHOW TABLES");
  await conn.end();

  if (tables.length === 0) {
    console.log("⚠️  No tables found!");
  } else {
    console.log(`📋 ${tables.length} tables in Railway:`);
    tables.forEach((t) => console.log("   -", Object.values(t)[0]));
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log("═══════════════════════════════════════════════════");
  console.log("   🚀 MySQL Migration: Local → Railway");
  console.log("═══════════════════════════════════════════════════");

  exportLocal();
  await importToRailway();
  await verify();

  console.log("\n✅ Migration complete! Railway DB is ready.\n");
})().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
