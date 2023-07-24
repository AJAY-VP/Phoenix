const moment = require('moment-timezone');

const userModel = require('../model/model.js');
const config = require('../config/config.json');
const mailService = require('../utility/mailService.js');

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

function getUserDetails(email){
  return new Promise((resolve,reject) => {
    userModel.getUser(email, (err, data) => {
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

function generateRandomNumber() {
  const min = 10000000; // Smallest 8-digit number (10^7)
  const max = 99999999; // Largest 8-digit number (10^8 - 1)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrentTimestampInEtcTime() {
  const currentTime = moment().tz('Etc/UTC').format('YYYY-MM-DD HH:mm:ss');
  return currentTime;
}

exports.getOtp = async(req, res) => {
  try {
    console.log("OTP")
    let email = req.query.loginId;
    const randomNumber = generateRandomNumber();
    let promise = getUserDetails(email);
    console.log(randomNumber);
    const timestamp = getCurrentTimestampInEtcTime();
    console.log(timestamp);
    promise.then((data) => {
      console.log(data);
      if(data == 'Data Not Found'){
        return res.status(500).send({
          status: 'error',
          response: 'User does not exist',
        });
      }
      else if(data.enabled == 0){
        return res.status(500).send({
          status: 'error',
          response: 'User not processed by admin yet',
        });
      }
      userModel.updateOTP(email, randomNumber,timestamp, (err, data) => {
        try {
          if (err) {
            return res.status(500).send({
              status: 'error',
              response: err.message || 'Error occured while accessing database',
            });
          }
           else if(data == 'Data Not Found'){
            return res.status(204).send({
              status: 'error',
              response: 'User does not exist',
            });
           }
           else {
            let mailDetails = {
              "otp" : randomNumber,
              "email": email
            }
            sendEmail('getOtp',mailDetails);
            return res.status(200).send({
              status: 'success',
              response: data,
            });
          }
        } catch (error) {
          return res.status(500).send({
            status: 'error',
            response: error.message || 'Error occured while fetching otp',
          });
        }
      });
    })
    .catch(err => {
      return res.status(500).send({
        status: 'error',
        response: 'Error occured while fetching otp',
      });
    })
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      response: error.message || 'Error occured while fetching otp',
    });
  }
};