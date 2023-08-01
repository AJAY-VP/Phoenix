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


User.getUser = (email,result) => {
  try {
    let queryDB = 'select firstName, lastName, email, mobileNumber, accessRequestReason, enabled, password from users where email = ?';
    let values = [email];
    sql.query(queryDB,values, (err, results) => {
      try {
        if (err)
          return result(err, null);
        if (results.length) {
          return result(null, JSON.parse(JSON.stringify(results[0])));
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

User.updateOTP = (email,otp,timestamp,result) => {
  try {
    const queryDB = 'Update users set otp = ?, otpTime = ? where email = ?';
    const values = [otp, timestamp, email];
    sql.query(queryDB,values, (err, results) => {
      try {
        console.log("res : ",results)
        if (err)
          return result(err, null);
        if (results.affectedRows > 0) {
          return result(null, 'One time password sent to your mail successfully');
        } else {
          return result(null, 'Data Not Found');
        }
      } catch (error) {
        console.log("err ",error)
        return result(error, null);
      }
    });
  } catch (error) {
    return result(error, null);
  }
};

module.exports = User;

