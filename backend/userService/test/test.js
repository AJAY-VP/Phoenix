const assert = require('assert');
const server = require('../userService.js');
const config = require('../app/config/config.json');
const port = config.port || process.env.PORT;
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
