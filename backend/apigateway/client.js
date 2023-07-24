const axios = require('axios');

const apiEndpoint = 'http://localhost:3000/api/otpService/v1/getOtp?loginId=test.99@gmail.com'; // Replace with the actual API endpoint
const emailParam = 'test@test.com'; // Replace with the email parameter

async function callApi100Times() {
  for (let i = 0; i < 100; i++) {
    try {
      const response = await axios.get(apiEndpoint);
      console.log(`API call ${i + 1} successful! Response:`, response.data);
    } catch (error) {
      console.error(`API call ${i + 1} failed! Error:`, error.message);
    }
  }
}

callApi100Times();