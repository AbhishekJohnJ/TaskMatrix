// Quick test script to verify backend connectivity
const axios = require('axios');

const API_URL = 'http://localhost:5000';

console.log('🔍 Testing TaskMatrix Backend Connection...\n');

async function testBackend() {
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Try to register a test user
    console.log('2️⃣ Testing user registration...');
    const testUser = {
      fullName: 'Test User',
      username: 'testuser' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'Test123456',
      confirmPassword: 'Test123456'
    };
    
    try {
      const registerResponse = await axios.post(`${API_URL}/api/auth/register`, testUser);
      console.log('✅ Registration successful!');
      console.log('   User ID:', registerResponse.data.data.user.id);
      console.log('   Email:', registerResponse.data.data.user.email);
      console.log('   Token received:', registerResponse.data.data.accessToken ? 'Yes' : 'No');
      console.log('');
      
      // Test 3: Try to login
      console.log('3️⃣ Testing user login...');
      const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful!');
      console.log('   Welcome:', loginResponse.data.data.user.fullName);
      console.log('');
      
      console.log('🎉 ALL TESTS PASSED! Backend is fully functional!\n');
      console.log('📝 Next steps:');
      console.log('   1. Go to http://localhost:5173/register');
      console.log('   2. Create your account');
      console.log('   3. Start using TaskMatrix!\n');
      
    } catch (regError) {
      if (regError.response) {
        console.log('⚠️  Registration test info:', regError.response.data);
      } else {
        throw regError;
      }
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running!');
      console.log('');
      console.log('📋 To start the backend:');
      console.log('   1. Open a new terminal');
      console.log('   2. Run: cd server');
      console.log('   3. Run: npm run dev');
      console.log('   4. Wait for "MongoDB connected successfully"');
      console.log('   5. Run this test again: node test-backend.js');
    } else {
      console.log('❌ Error:', error.message);
      if (error.response) {
        console.log('   Response:', error.response.data);
      }
    }
  }
}

testBackend();
