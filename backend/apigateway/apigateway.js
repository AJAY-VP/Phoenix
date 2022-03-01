const express = require('express');
const app = express();
const config = require('./app/config/config.json');

let port = config.Port;

var server = app.listen(port, () => {
    console.log("Apigateway server started on port: " + port);
})