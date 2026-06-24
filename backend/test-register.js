const axios = require('axios');

async function testRegistration() {
  let token = null;
  const uniqueId = Date.now();
  const email = `vendor${uniqueId}@test.com`;

  try {
    console.log(`Registering user with email: ${email}...`);
    const registerRes = await axios.post('http://localhost:5000/api/v1/auth/register', {
      name: 'Test Vendor',
      email: email,
      password: 'password123',
      role: 'VENDOR',
      phone: '08123456789'
    });
    
    console.log('Register Response:', registerRes.status);
    token = registerRes.data.data.accessToken;
    console.log('Got token:', token);
  } catch (err) {
    console.error('Register failed:', err.response?.data || err.message);
    return;
  }

  try {
    console.log('Creating vendor profile...');
    const profileRes = await axios.post('http://localhost:5000/api/v1/vendors/profile', {
      businessName: 'My Awesome Business',
      city: 'Jakarta',
      address: 'Jl. Test No 123',
      description: 'Main category: Photography'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Profile Response:', profileRes.status);
    console.log('Success!');
  } catch (err) {
    console.error('Profile creation failed:', err.response?.data || err.message);
  }
}

testRegistration();
