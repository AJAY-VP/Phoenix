const crypto = require('crypto');
const moment = require('moment-timezone');

const userModel = require('../model/model.js');
const axios = require('axios');
const config = require('../config/config.json');
const mailService = require('../utility/mailService.js');
const ResponseHandler = require('../utility/response.js');
const RECAPTCHA_SECRET_KEY = config.recaptchaSecretKey;

function getCurrentTimestampInEtcTime() {
  const currentTime = moment().tz('Etc/UTC').format('YYYY-MM-DD HH:mm:ss');
  return currentTime;
}

function hashPassword(password) {
  // Create a SHA256 hash object
  const sha256 = crypto.createHash('sha256');
  // Update the hash object with the password
  sha256.update(password);
  // Generate the hashed password in hexadecimal format
  const hashedPassword = sha256.digest('hex');
  return hashedPassword;
}

function generateRandomPassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%-_';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return {password: password, hashedPassword: hashPassword(password)};
}

function validateToken(captchaToken) {
  return new Promise(async(resolve, reject) => {
    try {
      let response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`);
      if (response.data.success) {
        // reCAPTCHA verification passed
        return resolve(true);
      } else {
        // reCAPTCHA verification failed
        return resolve(false);
      }
    } catch (error) {
      return reject(true);
    }
  })
}

function getUserDetails(email){
  return new Promise((resolve,reject) => {
    userModel.getUserForLogin(email, (err, data) => {
      try {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      } catch (error) {
        return reject(error);
      }
    });
  })
}

function verifyUserInfo(data,userDetails,res){
  try{
    const timestamp = getCurrentTimestampInEtcTime();
    console.log(timestamp);
    if(data == 'Data Not Found'){
      ResponseHandler.error(res,'User does not exist');
    }
    else if(data.enabled == 0){
      ResponseHandler.error(res,'User not processed by admin yet');
    }
    else if(data.password == null){
      ResponseHandler.error(res,'User password not set');
    }
    else{
      if(data.email != userDetails.loginId){
        ResponseHandler.error(res,'Incorrect User');
      }
      else if(data.password != userDetails.password){
        ResponseHandler.error(res,'Incorrect Password');
      }
      else if(data.otp != userDetails.otp){
        ResponseHandler.error(res,'Incorrect OTP');
      }
      else{
        const currentTimeMoment = moment(timestamp, 'YYYY-MM-DD HH:mm:ss');
        const specificTimestampMoment = moment(data.otpTime, 'YYYY-MM-DD HH:mm:ss');
        const differenceInSeconds = currentTimeMoment.diff(specificTimestampMoment, 'seconds');
        console.log(differenceInSeconds)
        if(differenceInSeconds <= 120){
          ResponseHandler.success(res,'Login Successful');
        }
        else{
          ResponseHandler.error(res,'OTP expired');
        }
      }
    }
  } catch(error){
    console.log(error);
    ResponseHandler.error(res,'Some Error occured while validating user credentials');
  }
}

function generateAndUpdatePassword(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const password = await generateRandomPassword(12);
      userModel.updatePassword(email, password.hashedPassword, (err, data) => {
        try {
          if (err) {
            return reject(err);
          } else if(data == "Data Not Found"){
            return reject('Error while generating password');
          } else{
            return resolve(password.password);
          }
        } catch (error) {
          return reject(error);
        }
      });
    } catch (error) {
      return reject('Error while generating password');
    }
  })
}

function sendEmail(callService,mailData){
    mailService[callService](mailData, function(err,data){
      try{
        if(err){
          console.log("error while sending email",err)
        }
      } catch(error){
        console.log("error while sending mail",error)
      }
    });
}

exports.getAllUsers = (req, res) => {
  try {
    userModel.getAllUsers((err, data) => {
      try {
        if (err) {
          ResponseHandler.error(res,err.message || 'Error occured while accessing database');
        } else {
          ResponseHandler.success(res,data);
        }
      } catch (error) {
        ResponseHandler.error(res,error.message || 'Error occured while fetching users');
      }
    });
  } catch (error) {
    ResponseHandler.error(res,error.message || 'Error occured while fetching users');
  }
};

exports.login = async (req, res) => {
  const captchaToken = req.body.captchaToken;
  try {
    const response = await validateToken(captchaToken);
    if (response) {
    let promise = getUserDetails(req.body.loginId);
    promise.then((data) => {
      console.log(data);
      verifyUserInfo(data,req.body,res);
      })
      .catch(err => {
        console.log(err);
        ResponseHandler.error(res,'Error occured while Login');
      })
    }
    else {
      ResponseHandler.custom(res,'error','reCAPTCHA verification failed',400);
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    ResponseHandler.error(res,'Server error');
  }
};

exports.registerUser = async (req, res) => {
  try {
    const captchaToken = req.body.captchaToken;
    const response = await validateToken(captchaToken);
    if (response) {
      userModel.registerUser(req.body,async (err, data) => {
        try {
          if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
              ResponseHandler.error(res,'User already exists');
            }
            else{
              ResponseHandler.error(res,err.message || 'Error occured while accessing database');
            }
          } else {
            sendEmail('registerUser',req.body);
            res.status(201).send({
              status: 'success',
              response: data,
            });
            let password;
            try{
              password = await generateAndUpdatePassword(req.body.email);
            } catch(error){
              console.log("error while generating password",error);
            }
            req.body['password'] = password
            sendEmail('sendPassword',req.body);
          }
        } catch (error) {
          ResponseHandler.error(res,error.message || 'Error occured while registering user');
        }
      });
    }
    else {
      ResponseHandler.custom(res,'error','reCAPTCHA verification failed',400);
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    ResponseHandler.error(res,'Server error');
  }
};