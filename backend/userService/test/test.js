const assert = require('assert');
var server = require('../userService.js')
const config = require('../app/config/config.json')
var port = config.port || process.env.PORT;
describe('server',function(){
    after(() => {
        server.close();
    })
    describe('Server Running port',()=> {
        it('Server should rum on port 3001',function(done){
            assert.equal(server.address().port,port);
            done();
        })
    })
})