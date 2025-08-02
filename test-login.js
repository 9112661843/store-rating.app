const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing admin login API...\n');
    
    const response = await axios.post('http://localhost:5000/api/login', {
      email: 'adi@gmail.com',
      password: 'Adi@123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Error:', error.response?.data || error.message);
  }
}

testLogin(); 