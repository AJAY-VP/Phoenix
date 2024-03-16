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
  this.password = user.password;
  this.otp = user.otp;
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

User.getUserForLogin = (email,result) => {
  try {
    let queryDB = `select u.id, up.privilege, up.id as userPrivilegeId, u.firstName, u.lastName, u.email, u.enabled, u.otp, u.otpTime, u.password
    from users u
    left join user_privilege up on
    u.userPrivilegeId = up.id
    where u.email = ?`;
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

User.updatePassword = (email,password,result) => {
  try {
    const query = 'UPDATE users set password = ? where email = ?';
    const values = [password,email];
    sql.query(query,values, (err, res, fields) => {
      if (err) {
        return result(err, null);
      }
      if (res.affectedRows > 0) {
        return result(null, 'User Password Updated Successfully');
      } else {
        return result(null, 'Data Not Found');
      }
    });
  } catch (error) {
    return result(error, null);
  }
};

module.exports = User;

