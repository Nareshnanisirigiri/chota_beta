const { query } = require("./src/config/database");

async function seed() {
  try {
    // Check if we already have withdrawal requests
    const countRes = await query("SELECT COUNT(*) AS count FROM delivery_boy_withdrawal_requests");
    if (countRes[0].count > 0) {
      console.log("Withdrawal requests already seeded.");
      process.exit(0);
    }
    
    // Seed requests
    await query(`
      INSERT INTO delivery_boy_withdrawal_requests (user_id, delivery_boy_id, amount, status, request_note, created_at, updated_at)
      VALUES 
      (21, 2, 500.00, 'pending', 'Need money for fuel', NOW(), NOW()),
      (29, 3, 1000.00, 'approved', 'Monthly savings withdrawal', NOW(), NOW()),
      (21, 2, 200.00, 'rejected', 'Incorrect bank details', NOW(), NOW())
    `);
    
    console.log("Successfully seeded 3 withdrawal requests!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
