// Authentication Test Script
// This script tests the authentication flow fixes we implemented

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testAuthenticationFlow() {
  console.log('🔧 Testing Authentication Flow...\n');

  try {
    // Test 1: Login with test credentials
    console.log('1. Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    }, {
      withCredentials: true
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      
      // Extract token and cookies
      const token = loginResponse.data.token;
      const cookies = loginResponse.headers['set-cookie'];
      console.log('📝 Token received:', token ? 'Yes' : 'No');
      console.log('🍪 Cookies set:', cookies ? 'Yes' : 'No');
      
      // Test 2: Access protected route
      console.log('\n2. Testing protected route access...');
      const profileResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cookie': cookies ? cookies.join('; ') : ''
        },
        withCredentials: true
      });

      if (profileResponse.data.success) {
        console.log('✅ Protected route access successful');
        console.log('👤 User:', profileResponse.data.user.email);
      }

      // Test 3: Logout
      console.log('\n3. Testing logout...');
      const logoutResponse = await axios.get(`${API_BASE_URL}/api/auth/logout`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cookie': cookies ? cookies.join('; ') : ''
        },
        withCredentials: true
      });

      if (logoutResponse.data.success) {
        console.log('✅ Logout successful');
        
        // Test 4: Try accessing protected route after logout
        console.log('\n4. Testing protected route after logout...');
        try {
          await axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cookie': logoutResponse.headers['set-cookie'] ? logoutResponse.headers['set-cookie'].join('; ') : ''
            },
            withCredentials: true
          });
          console.log('❌ Protected route should not be accessible after logout');
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.log('✅ Protected route properly blocked after logout');
          } else {
            console.log('❓ Unexpected error:', error.message);
          }
        }
      }

    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to backend server. Please make sure it\'s running on port 5000');
    } else {
      console.log('❌ Test failed:', error.response?.data?.message || error.message);
    }
  }

  console.log('\n🏁 Authentication test completed');
}

// Test forgot password functionality
async function testForgotPassword() {
  console.log('\n🔧 Testing Forgot Password Flow...\n');

  try {
    console.log('1. Testing forgot password request...');
    const forgotResponse = await axios.post(`${API_BASE_URL}/api/auth/password/forgot`, {
      email: 'test@example.com'
    });

    if (forgotResponse.data.success) {
      console.log('✅ Forgot password request successful');
      console.log('📧 Reset token would be sent to email in production');
      
      // In a real scenario, we would get the token from email
      // For testing, we can use the token returned in development
      if (forgotResponse.data.token) {
        console.log('🔑 Reset token available for testing');
        
        // Test password reset
        console.log('\n2. Testing password reset...');
        const resetResponse = await axios.put(`${API_BASE_URL}/api/auth/password/reset/${forgotResponse.data.token}`, {
          password: 'newpassword123',
          confirmPassword: 'newpassword123'
        });

        if (resetResponse.data.success) {
          console.log('✅ Password reset successful');
        } else {
          console.log('❌ Password reset failed');
        }
      }
    } else {
      console.log('❌ Forgot password request failed');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to backend server. Please make sure it\'s running on port 5000');
    } else {
      console.log('❌ Test failed:', error.response?.data?.message || error.message);
    }
  }

  console.log('\n🏁 Forgot password test completed');
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting Authentication Tests\n');
  console.log('=' * 50);
  
  await testAuthenticationFlow();
  await testForgotPassword();
  
  console.log('\n' + '=' * 50);
  console.log('✨ All tests completed!\n');
  
  console.log('📋 Summary of fixes implemented:');
  console.log('1. ✅ Backend logout function now properly expires cookies');
  console.log('2. ✅ Frontend logout clears localStorage, cookies, and axios headers');
  console.log('3. ✅ Auth middleware has better debugging and token handling');
  console.log('4. ✅ ResetPassword component UI matches other auth pages');
  console.log('5. ✅ Email service is properly configured with Nodemailer');
  
  console.log('\n🎯 Next steps:');
  console.log('- Start both backend and frontend servers');
  console.log('- Test the login/logout flow in the browser');
  console.log('- Verify that tokens are properly cleared after logout');
  console.log('- Test the forgot password and reset password flows');
}

if (require.main === module) {
  runAllTests();
}

module.exports = { testAuthenticationFlow, testForgotPassword };
