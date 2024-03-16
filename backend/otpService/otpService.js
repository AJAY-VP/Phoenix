const express = require('express');
const routes = require('./app/routes/routes.js');
const config = require('./app/config/config.json');
const dbConnection = require('./dbConnection/db.js');
const port = process.env.PORT || config.port;
const host = process.env.UI_HOST || config.uiHost;
const app = express();
const cors = require('cors');

const corsOptions = {
  origin: host, // Replace with the allowed origin (or '*' to allow all origins)
};

function validateRequest(req, res, next) {
  console.log(req.headers);
  if(req.headers['x-gateway-routed'] == 'true' && req.headers['secondary'])
    next();
  else 
  return res.status(500).send({status: 'error', response: 'Invalid Access'});
}

app.use(cors(corsOptions));
app.use(validateRequest);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);
//  Error 404
app.use((req, res, next) => {
  return res.status(404).send({status: 'error', response: 'System Error'});
});

//  Error 500
app.use((req, res, next) => {
  return res.status(500).send({status: 'error', response: 'System Error'});
});

const server = app.listen(port, () => {
  console.log('server started on port : ' + port);
});

module.exports = server;

process
    .on('unhandledRejection', (reason, promise) => {
      console.log('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    })
    .on('uncaughtException', (err) => {
      console.error('There was an uncaught error', err);
      process.exit(1); // mandatory (as per the Node.js docs)
    })
    .on('SIGINT', (err) => {
      server.close(()=>{
        process.exit(0);
      });
    })
    .on('SIGTERM', (err) => {
      server.close(()=>{
        process.exit(0);
      });
    })
    .on('exit', () =>{
      console.log('Exiting otpService');
      dbConnection.end();
    });


