var mysql = require('mysql');
var dbConfig = require('../app/config/dbConfig.json')
var host = dbConfig.host || process.env.DB_HOST;
var port = dbConfig.port || process.env.DB_PORT;
var user = dbConfig.user || process.env.DB_USER;
var password = dbConfig.password || process.env.DB_PASSWORD;
var database = dbConfig.database || process.env.DB_NAME;
var connectionLimit = dbConfig.connectionLimit|| process.env.DB_CONNECTIONLIMIT;
var dbConnection = mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    connectionLimit,
    timezone: 'utc',
    dateStrings: [
        'DATE',
        'DATETIME'
    ]
});

var dateOccured = new Date().toISOString().slice(0,19).replace("T"," ");

dbConnection.on('connection', (connection) => {
    console.log("Successfully connected to database");

    connection.on('error',(err)=>{
        console.log("Database connection error",err.code,dateOccured);
    })

    connection.on('disconnect',(err)=>{
        console.log("Disconnected from database",err.code,dateOccured);
    })

    connection.on('close',(err)=>{
        console.log("Datebase connection closed",err,dateOccured);
    })
})

module.exports = dbConnection;
