const { query } = require("../src/config/database");

async function printTableSummary(tableName, limit = 5) {
  try {
    const columnsInfo = await query(`DESCRIBE \`${tableName}\``);
    const columns = columnsInfo.map(c => c.Field);
    
    // Pick a subset of columns to display nicely
    // Prefer columns like id, name, email, title, status, created_at, etc.
    const preferred = ['id', 'uuid', 'name', 'title', 'email', 'mobile', 'phone', 'contact_number', 'sku', 'price', 'total', 'final_total', 'status', 'payment_status', 'billing_name', 'slug', 'created_at'];
    const toSelect = columns.filter(c => preferred.includes(c));
    
    // If we couldn't match enough, just grab the first 6 columns
    if (toSelect.length < 3) {
      toSelect.push(...columns.slice(0, 6));
    }
    
    // De-duplicate
    const selectFields = [...new Set(toSelect)].map(f => `\`${f}\``).join(', ');
    
    const [countResult] = await query(`SELECT COUNT(*) AS count FROM \`${tableName}\``);
    const totalCount = countResult.count;
    
    const rows = await query(`SELECT ${selectFields} FROM \`${tableName}\` LIMIT ${limit}`);
    
    console.log(`\n======================================================================`);
    console.log(`[${tableName.toUpperCase()}] (Showing sample of ${rows.length} rows out of ${totalCount} total)`);
    console.log(`======================================================================`);
    console.table(rows);
  } catch (err) {
    console.error(`Error printing summary for table ${tableName}:`, err.message);
  }
}

async function run() {
  console.log("=========================================");
  console.log("DATABASE: chota_beta_live - DATA SUMMARY");
  console.log("=========================================");

  await printTableSummary('users');
  await printTableSummary('stores');
  await printTableSummary('products');
  await printTableSummary('orders');
  await printTableSummary('categories');
  await printTableSummary('delivery_boys');

  process.exit(0);
}

run();
