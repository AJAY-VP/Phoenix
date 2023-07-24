const userModel = require('../model/model.js');
const axios = require('axios');
const config = require('../config/config.json');
const mailService = require('../utility/mailService.js');
const RECAPTCHA_SECRET_KEY = config.recaptchaSecretKey;

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
          return res.status(500).send({
            status: 'error',
            response: err.message || 'Error occured while accessing database',
          });
        } else {
          return res.status(200).send({
            status: 'success',
            response: data,
          });
        }
      } catch (error) {
        return res.status(500).send({
          status: 'error',
          response: error.message || 'Error occured while fetching users',
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      response: error.message || 'Error occured while fetching users',
    });
  }
};

exports.login = async (req, res) => {
  const { captchaToken } = req.body.captchaToken;
  try {
    const response = await validateToken(captchaToken);
    if (response) {

    }
    else {
      return res.status(400).send({
        status: "error",
        response: 'reCAPTCHA verification failed'
      });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).send({
      status: "error",
      response: 'Server error'
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const captchaToken = req.body.captchaToken;
    const response = await validateToken(captchaToken);
    if (response) {
      userModel.registerUser(req.body,(err, data) => {
        try {
          if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
              return res.status(500).send({
                status: 'error',
                response: 'User already exists',
              });
            }
            else{
              return res.status(500).send({
                status: 'error',
                response: err.message || 'Error occured while accessing database',
              });
            }
          } else {
            sendEmail('registerUser',req.body);
            return res.status(200).send({
              status: 'success',
              response: data,
            });
          }
        } catch (error) {
          return res.status(500).send({
            status: 'error',
            response: error.message || 'Error occured while registering user',
          });
        }
      });
    }
    else {
      return res.status(400).send({
        status: "error",
        response: 'reCAPTCHA verification failed'
      });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).send({
      status: "error",
      response: 'Server error'
    });
  }
};