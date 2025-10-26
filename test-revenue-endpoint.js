const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Admin credentials
const adminCredentials = {
  email: 'admin@anzacash.com',
  password: 'AdminPass123!'
};

async function testRevenueEndpoint() {
  console.log('💰 Testing Admin Revenue Endpoint...\n');

  try {
    // Step 1: Login as admin
    console.log('📝 Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, adminCredentials);
    const adminToken = loginResponse.data.data.token;
    console.log('✅ Admin login successful');
    console.log('');

    // Step 2: Test the revenue endpoint
    console.log('💰 Testing: GET /api/admin/revenue/current-month');
    try {
      const revenueResponse = await axios.get(`${API_BASE_URL}/admin/revenue/current-month`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Revenue endpoint working successfully');
      console.log('');
      console.log('📊 Revenue Data:');
      const data = revenueResponse.data.data;
      console.log(`  Total Revenue: $${data.totalRevenue.toFixed(2)}`);
      console.log(`  Platform Revenue: $${data.platformRevenue.toFixed(2)}`);
      console.log(`  Vendor Revenue: $${data.vendorRevenue.toFixed(2)}`);
      console.log(`  Total Orders: ${data.totalOrders}`);
      console.log(`  Average Order Value: $${data.averageOrderValue.toFixed(2)}`);
      console.log(`  Currency: ${data.currency}`);
      console.log(`  Period: ${data.period}`);
      console.log(`  Generated At: ${data.generatedAt}`);

    } catch (error) {
      console.log('❌ Revenue endpoint failed:', error.response?.data || error.message);
    }
    console.log('');

    // Step 3: Test authorization (should fail)
    console.log('🚫 Testing authorization without token...');
    try {
      await axios.get(`${API_BASE_URL}/admin/revenue/current-month`);
      console.log('❌ Authorization test failed - should have blocked access');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authorization working correctly - blocked unauthenticated access');
        console.log('Error:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    console.log('🏁 Revenue endpoint testing complete!');
    console.log('\n📚 Endpoint Details:');
    console.log('URL: GET http://localhost:3000/api/admin/revenue/current-month');
    console.log('Authentication: Required (Admin role only)');
    console.log('Response: Monthly revenue metrics with total, platform, and vendor revenue');

  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start with: npm run dev');
    }
  }
}

// Run the test
testRevenueEndpoint();