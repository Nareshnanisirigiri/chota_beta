const { query } = require("./src/config/database");

async function checkRecords() {
  try {
    const boysCount = await query("SELECT COUNT(*) AS count FROM delivery_boys");
    const assignmentsCount = await query("SELECT COUNT(*) AS count FROM delivery_boy_assignments");
    const withdrawalsCount = await query("SELECT COUNT(*) AS count FROM delivery_boy_withdrawal_requests");
    const cashCount = await query("SELECT COUNT(*) AS count FROM delivery_boy_cash_transactions");
    const feedbackCount = await query("SELECT COUNT(*) AS count FROM delivery_feedback");
    
    console.log("Record Counts:");
    console.log("delivery_boys:", boysCount[0].count);
    console.log("delivery_boy_assignments:", assignmentsCount[0].count);
    console.log("delivery_boy_withdrawal_requests:", withdrawalsCount[0].count);
    console.log("delivery_boy_cash_transactions:", cashCount[0].count);
    console.log("delivery_feedback:", feedbackCount[0].count);

    if (boysCount[0].count > 0) {
      const sampleBoys = await query("SELECT * FROM delivery_boys LIMIT 3");
      console.log("\nSample Delivery Boys:", JSON.stringify(sampleBoys, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkRecords();
