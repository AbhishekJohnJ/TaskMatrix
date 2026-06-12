// Quick Backend Health Check Script
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function checkBackend() {
  console.log('🔍 Checking backend server...\n');
  
  try {
    // Check if server is running
    console.log('1️⃣ Testing server connection...');
    const response = await axios.get(`${API_URL}/health`, { 
      timeout: 3000,
      validateStatus: () => true // Accept any status
    });
    
    if (response.status === 200) {
      console.log('✅ Backend server is running!\n');
    } else if (response.status === 404) {
      console.log('⚠️  Server is running but /health endpoint not found');
      console.log('   Trying alternative check...\n');
      
      // Try auth endpoint instead
      try {
        await axios.get(`${API_URL}/auth/me`, {
          timeout: 3000,
          validateStatus: () => true
        });
        console.log('✅ Backend server is running (confirmed via /auth endpoint)\n');
      } catch (e) {
        console.log('⚠️  Could not confirm server status\n');
      }
    }
    
    console.log('📋 Available endpoints for testing:');
    console.log('   - Teams: GET ' + API_URL + '/teams');
    console.log('   - Tasks: GET ' + API_URL + '/tasks');
    console.log('   - User:  GET ' + API_URL + '/users/me');
    console.log('\n💡 Make sure you have a valid JWT token to access protected routes');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is NOT running!');
      console.log('\n🔧 To start the backend:');
      console.log('   cd server');
      console.log('   npm install  (if not done already)');
      console.log('   npm start');
      console.log('\n📝 Make sure MongoDB is also running:');
      console.log('   - Check connection string in server/.env');
      console.log('   - Verify MongoDB service is active');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('❌ Connection timeout - server might be starting or overloaded');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

// Check if axios is available
try {
  checkBackend();
} catch (err) {
  console.log('❌ axios is not installed.');
  console.log('Run: npm install axios');
}
