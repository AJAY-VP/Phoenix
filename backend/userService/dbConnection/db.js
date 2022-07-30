const mysql = require('mysql');
const dbConfig = require('../app/config/dbConfig.json');
const host = dbConfig.host || process.env.DB_HOST;
const port = dbConfig.port || process.env.DB_PORT;
const user = dbConfig.user || process.env.DB_USER;
const password = dbConfig.password || process.env.DB_PASSWORD;
const database = dbConfig.database || process.env.DB_NAME;
// eslint-disable-next-line max-len
const connectionLimit = dbConfig.connectionLimit|| process.env.DB_CONNECTIONLIMIT;
const dbConnection = mysql.createConnection({
  host,
  port,
  user,
  password,
  database,
  connectionLimit,
  timezone: 'utc',
  dateStrings: [
    'DATE',
    'DATETIME',
  ],
});

const dateOccured = new Date().toISOString().slice(0, 19).replace('T', '');

dbConnection.on('connection', (connection) => {
  console.log('Successfully connected to database');

  connection.on('error', (err)=>{
    console.log('Database connection error', err.code, dateOccured);
  });

  connection.on('disconnect', (err)=>{
    console.log('Disconnected from database', err.code, dateOccured);
  });

  connection.on('close', (err)=>{
    console.log('Datebase connection closed', err, dateOccured);
  });
});

module.exports = dbConnection;
