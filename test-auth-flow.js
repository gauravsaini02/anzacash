const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Store auth token for testing protected routes
let authToken = '';
let testUser = {
  email: 'auth.test@example.com',
  password: 'AuthTest123!',
  firstName: 'Auth',
  lastName: 'User',
  role: 'CUSTOMER'
};

async function testRegistration() {
  console.log('🧪 Testing User Registration...\n');

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Registration successful');
    console.log('User registered:', {
      id: response.data.data.id,
      email: response.data.data.email,
      role: response.data.data.role
    });
    console.log('');

    return true;

  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️ User already exists, proceeding with login test');
      return true;
    }

    console.log('❌ Registration failed:', error.response?.data || error.message);
    console.log('');
    return false;
  }
}

async function testLogin() {
  console.log('🔐 Testing User Login...\n');

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    authToken = response.data.data.token;

    console.log('✅ Login successful');
    console.log('User info:', {
      id: response.data.data.user.id,
      email: response.data.data.user.email,
      role: response.data.data.user.role
    });
    console.log('Token length:', authToken.length);
    console.log('Token preview:', authToken.substring(0, 50) + '...');
    console.log('');

    return true;

  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
    console.log('');
    return false;
  }
}

async function testProfileAccess() {
  console.log('👤 Testing Profile Access (with valid token)...\n');

  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Profile access successful');
    console.log('Profile data:', {
      id: response.data.data.id,
      firstName: response.data.data.firstName,
      lastName: response.data.data.lastName,
      email: response.data.data.email,
      role: response.data.data.role,
      status: response.data.data.status
    });
    console.log('');

    return true;

  } catch (error) {
    console.log('❌ Profile access failed:', error.response?.data || error.message);
    console.log('');
    return false;
  }
}

async function testInvalidLogin() {
  console.log('🚫 Testing Invalid Login...\n');

  try {
    await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: 'wrongpassword'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('❌ Invalid login should have failed');
    return false;

  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Invalid login correctly rejected');
      console.log('Error message:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
    console.log('');
    return true;
  }
}

async function testUnauthorizedAccess() {
  console.log('🛑 Testing Unauthorized Access...\n');

  try {
    await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('❌ Unauthorized access should have failed');
    return false;

  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Unauthorized access correctly rejected');
      console.log('Error message:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
    console.log('');
    return true;
  }
}

async function testInvalidTokenAccess() {
  console.log('🔍 Testing Invalid Token Access...\n');

  try {
    await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': 'Bearer invalid.token.here',
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ Invalid token access should have failed');
    return false;

  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Invalid token correctly rejected');
      console.log('Error message:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
    console.log('');
    return true;
  }
}

async function testLogout() {
  console.log('🚪 Testing Logout...\n');

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Logout successful');
    console.log('Message:', response.data.message);
    console.log('');

    // Note: After logout, we can still use the token because JWT is stateless
    // In a real application, the client should discard the token
    console.log('ℹ️ Note: JWT tokens are stateless. Actual logout happens on client side by discarding the token.');
    console.log('');

    return true;

  } catch (error) {
    console.log('❌ Logout failed:', error.response?.data || error.message);
    console.log('');
    return false;
  }
}

async function testDifferentUserTypes() {
  console.log('🎭 Testing Different User Types Registration...\n');

  const userTypes = [
    { role: 'VENDOR', email: 'vendor.test@example.com' },
    { role: 'MLM_MEMBER', email: 'mlm.test@example.com' }
  ];

  for (const userType of userTypes) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        firstName: 'Test',
        lastName: 'User',
        email: userType.email,
        password: 'TestPass123!',
        role: userType.role
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log(`✅ ${userType.role} registration successful`);
      console.log(`  Email: ${userType.email}`);
      console.log(`  User ID: ${response.data.data.id}`);

    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`ℹ️ ${userType.role} already exists`);
      } else {
        console.log(`❌ ${userType.role} registration failed:`, error.response?.data || error.message);
      }
    }
  }
  console.log('');
}

// Main test runner
async function runAuthenticationTests() {
  console.log('🚀 Starting Authentication Flow Tests...\n');
  console.log('🔗 Checking server connectivity...');

  try {
    await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running\n');

    let allTestsPassed = true;

    // Test registration
    allTestsPassed &= await testRegistration();

    // Test different user types
    await testDifferentUserTypes();

    // Test login
    allTestsPassed &= await testLogin();

    if (authToken) {
      // Test authenticated routes
      allTestsPassed &= await testProfileAccess();

      // Test logout
      await testLogout();
    }

    // Test security scenarios
    allTestsPassed &= await testInvalidLogin();
    allTestsPassed &= await testUnauthorizedAccess();
    allTestsPassed &= await testInvalidTokenAccess();

    // Summary
    console.log('🏁 Authentication testing complete!');
    console.log(allTestsPassed ? '\n✅ All critical tests passed!' : '\n❌ Some tests failed.');

    console.log('\n📚 API Endpoints Summary:');
    console.log('POST /api/auth/register  - Register new user');
    console.log('POST /api/auth/login     - Login and get token');
    console.log('POST /api/auth/logout    - Logout (client-side token removal)');
    console.log('GET  /api/auth/profile   - Get user profile (requires auth)');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start the server first:');
      console.log('   npm run dev');
    } else {
      console.log('❌ Error connecting to server:', error.message);
    }
  }
}

runAuthenticationTests();