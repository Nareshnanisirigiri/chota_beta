const { query } = require("../src/config/database");

async function check() {
  try {
    const tables = ["subscription_plans", "subscription_plan_limits", "subscription_transactions", "seller_subscriptions"];
    for (const t of tables) {
      const desc = await query(`DESCRIBE ${t}`);
      console.log(`\n--- SCHEMA OF ${t} ---`);
      console.log(JSON.stringify(desc, null, 2));

      const count = await query(`SELECT COUNT(*) AS c FROM ${t}`);
      console.log(`Count in ${t}:`, count[0].c);

      if (count[0].c > 0) {
        const rows = await query(`SELECT * FROM ${t} LIMIT 3`);
        console.log(`Sample rows from ${t}:`, JSON.stringify(rows, null, 2));
      }
    }

    // Let's also check settings for subscriptions
    const subSettings = await query("SELECT * FROM settings WHERE variable LIKE '%sub%' OR variable LIKE '%cron%' OR variable LIKE '%scheduler%'");
    console.log("\n--- SUBSCRIPTION SETTINGS ---");
    console.log(JSON.stringify(subSettings, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("Error checking subscriptions:", err);
    process.exit(1);
  }
}

check();
