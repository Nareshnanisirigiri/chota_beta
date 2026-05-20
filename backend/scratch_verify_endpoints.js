const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  try {
    console.log("--- Testing Health Endpoint ---");
    const health = await get('/health');
    console.log("Health Status:", health.statusCode);
    console.log("Health Body:", health.body);

    console.log("\n--- Testing Delivery Boys List Endpoint ---");
    const boys = await get('/api/delivery-boys');
    console.log("Delivery Boys Status:", boys.statusCode);
    console.log("Delivery Boys Pagination:", boys.body.pagination);
    console.log("Delivery Boys Count:", boys.body.data ? boys.body.data.length : 'N/A');
    if (boys.body.data && boys.body.data.length > 0) {
      console.log("Sample Delivery Boy:", boys.body.data[0]);
    }

    console.log("\n--- Testing Delivery Zones Endpoint ---");
    const zones = await get('/api/delivery-boys/zones');
    console.log("Zones Status:", zones.statusCode);
    console.log("Zones Data:", zones.body.data);

    console.log("\n--- Testing Pending Earnings Endpoint ---");
    const earnings = await get('/api/delivery-boys/earnings');
    console.log("Earnings Status:", earnings.statusCode);
    console.log("Earnings Count:", earnings.body.data ? earnings.body.data.length : 'N/A');

    console.log("\n--- Testing Pending Cash Collections Endpoint ---");
    const cash = await get('/api/delivery-boys/cash-collections');
    console.log("Cash Collections Status:", cash.statusCode);
    console.log("Cash Collections Count:", cash.body.data ? cash.body.data.length : 'N/A');

    console.log("\n--- Testing Pending Withdrawals Endpoint ---");
    const withdrawals = await get('/api/delivery-boys/withdrawals');
    console.log("Withdrawals Status:", withdrawals.statusCode);
    console.log("Withdrawals Count:", withdrawals.body.data ? withdrawals.body.data.length : 'N/A');

    process.exit(0);
  } catch (error) {
    console.error("Test failed with error:", error);
    process.exit(1);
  }
}

runTests();
