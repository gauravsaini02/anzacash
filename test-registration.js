const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testRegistration() {
  console.log('🧪 Testing Unified Registration System...\n');

  // Test cases for different user types
  const testUsers = [
    {
      name: 'Customer Registration',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePassword123',
        role: 'CUSTOMER',
        phone: '+1234567890'
      }
    },
    {
      name: 'Vendor Registration',
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'VendorPass123!',
        role: 'VENDOR',
        phone: '+1987654321'
      }
    },
    {
      name: 'MLM Member Registration',
      data: {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        password: 'MLMMember123!',
        role: 'MLM_MEMBER',
        phone: '+1122334455'
      }
    }
  ];

  for (const test of testUsers) {
    try {
      console.log(`📝 Testing: ${test.name}`);

      const response = await axios.post(`${API_BASE_URL}/auth/register`, test.data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Success: ${test.name}`);
      console.log('Response:', {
        status: response.status,
        userId: response.data.data.id,
        email: response.data.data.email,
        role: response.data.data.role,
        status: response.data.data.status
      });
      console.log('');

    } catch (error) {
      console.log(`❌ Failed: ${test.name}`);
      if (error.response) {
        console.log('Error Response:', {
          status: error.response.status,
          message: error.response.data.error || error.response.data.message
        });
      } else {
        console.log('Network Error:', error.message);
      }
      console.log('');
    }
  }

  // Test duplicate registration
  try {
    console.log('📝 Testing: Duplicate Registration');

    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUsers[0].data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ Unexpected success with duplicate registration');

  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✅ Duplicate registration correctly rejected');
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
  }

  console.log('\n🏁 Registration testing complete!');
}

// Test validation
async function testValidation() {
  console.log('\n🔍 Testing Input Validation...\n');

  const invalidTests = [
    {
      name: 'Missing required fields',
      data: { firstName: 'Test' }
    },
    {
      name: 'Invalid email format',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'password123',
        role: 'CUSTOMER'
      }
    },
    {
      name: 'Short password',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: '123',
        role: 'CUSTOMER'
      }
    },
    {
      name: 'Invalid role',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'INVALID_ROLE'
      }
    }
  ];

  for (const test of invalidTests) {
    try {
      console.log(`📝 Testing: ${test.name}`);

      const response = await axios.post(`${API_BASE_URL}/auth/register`, test.data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('❌ Validation failed - should have rejected this request');

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly rejected request');
        console.log('Error message:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');
  }
}

// Run tests if server is running
async function runTests() {
  try {
    console.log('🔗 Checking if server is running...');
    await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running\n');

    await testRegistration();
    await testValidation();

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start the server first:');
      console.log('   npm run dev');
    } else {
      console.log('❌ Error connecting to server:', error.message);
    }
  }
}

runTests();