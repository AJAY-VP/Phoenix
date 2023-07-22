const mysql = require('mysql');
const dbConfig = require('../app/config/dbConfig.json');
const host = process.env.DB_HOST || dbConfig.host;
const port = process.env.DB_PORT || dbConfig.port;
const user = process.env.DB_USER || dbConfig.user;
const password = process.env.DB_PASSWORD || dbConfig.password;
const database = process.env.DB_NAME || dbConfig.database;
// eslint-disable-next-line max-len
const connectionLimit = process.env.DB_CONNECTIONLIMIT || dbConfig.connectionLimit;
const dbConnection = mysql.createPool({
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
