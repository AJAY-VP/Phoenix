const assert = require('assert');
const server = require('../otpService.js');
const config = require('../app/config/config.json');
const port = process.env.PORT || config.port;
describe('server', function() {
  after(() => {
    server.close();
  });
  describe('Server Running port', ()=> {
    it('Server should rum on port 3001', function(done) {
      assert.equal(server.address().port, port);
      done();
    });
  });
});
