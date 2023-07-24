const axios = require('axios');

const totalRequests = 1; // Change this number to simulate more or fewer requests
const delayBetweenRequests = 100; // Delay between each request in milliseconds
const results = [];

function sendRequests() {
  const startTime = Date.now();
  const requests = Array.from({ length: totalRequests }, () =>
    axios.get('http://localhost:3000/api/userService/user')
      .then(response => {
        const endTime = Date.now();
        console.log({ requestNumber: results.length + 1, status: response.status, duration: endTime - startTime });
        results.push({ requestNumber: results.length + 1, status: response.status, duration: endTime - startTime });
      })
      .catch(error => {
        const endTime = Date.now();
        console.log({ requestNumber: results.length + 1, status: error ? error : 'Error', duration: endTime - startTime  });
        results.push({ requestNumber: results.length + 1, status: error.response ? error.response.status : 'Error', duration: endTime - startTime  });
      })
  );

  Promise.all(requests)
    .then(() => {
      console.log('Results:');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

sendRequests();
