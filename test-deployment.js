const axios = require('axios');

// Test your deployed backend
const testBackend = async () => {
  const backendUrl = process.argv[2] || 'http://localhost:5000';
  
  console.log(`Testing backend at: ${backendUrl}`);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${backendUrl}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test registration endpoint
    console.log('\n2. Testing registration endpoint...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123!',
      address: 'Test Address'
    };
    
    const registerResponse = await axios.post(`${backendUrl}/api/register`, testUser);
    console.log('✅ Registration test passed:', registerResponse.data);
    
    // Test login endpoint
    console.log('\n3. Testing login endpoint...');
    const loginResponse = await axios.post(`${backendUrl}/api/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login test passed:', loginResponse.data);
    
    console.log('\n🎉 All tests passed! Your backend is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure your backend is deployed and running');
    console.log('2. Check if the URL is correct');
    console.log('3. Verify environment variables are set');
    console.log('4. Check backend logs for errors');
  }
};

testBackend(); 