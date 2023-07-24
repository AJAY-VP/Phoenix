const sql = require('../../dbConnection/db.js');
//  const spConfig = require('../config/dbSp.json');

//  Constructor for users table entries

const User = function (user) {
  this.id = user.id;
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.email = user.email;
  this.mobileNumber = user.mobileNumber;
  this.enabled = user.enabled;
  this.userPrivilegeId = user.userPrivilegeId;
  this.accessRequestReason = user.accessRequestReason;
};

User.getAllUsers = (result) => {
  try {
    let queryDB = 'select firstName, lastName, email, mobileNumber, accessRequestReason from users';
    sql.query(queryDB, (err, results) => {
      try {
        if (err)
          return result(err, null);
        if (results.length) {
          return result(null, JSON.parse(JSON.stringify(results)));
        } else {
          return result(null, 'Data Not Found');
        }
      } catch (error) {
        return result(error, null);
      }
    });
  } catch (error) {
    return result(error, null);
  }
};

User.registerUser = (userDetails, result) => {
  try {
    console.log(userDetails);
    const query = 'INSERT INTO users (firstName, lastName, email, mobileNumber, accessRequestReason, countryCode) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [userDetails.firstName, userDetails.lastName, userDetails.email, userDetails.mobileNumber, userDetails.requestReason, userDetails.countryCode];
    sql.query(query,values, (err, res, fields) => {
      if (err) {
        return result(err, null);
      }
      if (res.insertId > 0) {
        return result(null, 'User Registered Successfully');
      } else {
        return result(null, 'Data Not Found');
      }
    });
  } catch (error) {
    return result(error, null);
  }
};

module.exports = User;

