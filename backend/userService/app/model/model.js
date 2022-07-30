const sql = require('../../dbConnection/db.js');
//  const spConfig = require('../config/dbSp.json');

//  Constructor for users table entries

const User = function(user) {
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
    sql.query('select * from users', (err, res, fields) => {
      console.log(err, res);
      if (err) {
        return result(err, null);
      }
      if (res.length) {
        return result(null, JSON.parse(JSON.stringify(res[0])));
      } else {
        return result(null, 'Data Not Found');
      }
    });
  } catch (error) {
    return result(error, null);
  }
};

module.exports = User;

