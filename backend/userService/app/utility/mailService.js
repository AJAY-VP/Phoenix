const nodemailer = require('nodemailer');
const config = require('../config/mailConfig.json');

const fromUser = config.fromUser;
const fromUserPass = config.fromUserPass;
const appName = config.appName;

// Configure your nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: fromUser, // Replace with your email
    pass: fromUserPass, // Replace with your email password
  },
});

function mailBodyGenerate(template,mailDetails){
    return new Promise((resolve) => {
        const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
        </style>
        </head>
        <body>
          <div class="container">
            {{emailBody}}
            <div class="footer">
              <p>Best regards,</p>
              <p>Phoenix Admin team</p>
            </div>
          </div>
        </body>
        </html>
      `;
        switch (template){
            case 'registerUser': {
                var emailBody = `<div class="content"><p>Hi ${mailDetails.firstName} ${mailDetails.lastName},</p>`;
                emailBody += '<p>You have been successfully registered in Our Tool. Our admin team will now process the next steps.</p>';
                emailBody += '<p>Thank you for joining us!</p></div>';
                const personalizedEmailHTML = emailHTML.replace('{{emailBody}}', emailBody);
                resolve(personalizedEmailHTML);
            }
            case 'firstTimePassword': {
              var emailBody = `<div class="content"><p>Hi ${mailDetails.firstName} ${mailDetails.lastName},</p>`;
              emailBody += `<p>You passwrod is ${mailDetails.password}. Please use this password to login and change the password after that.</p>`;
              emailBody += '<p>Thank you for joining us!</p></div>';
              const personalizedEmailHTML = emailHTML.replace('{{emailBody}}', emailBody);
              resolve(personalizedEmailHTML);
          }
        }
    });
}

function sendEmail(to, subject, mailbody){
    // Email message options
  let from = appName + ' Messaging' + '<' + fromUser + '>';
  const mailOptions = {
    from: from, // Replace with your email
    to: to, // Replace with the recipient's email
    subject: subject,
    html: mailbody,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

var service = {
    registerUser: async function(mailDetails, result){
        try{
        let subject = "User Registration Mail";
        let mailBody = await mailBodyGenerate('registerUser',mailDetails);
        sendEmail(mailDetails.email,subject,mailBody);
        } catch(error){
            console.log("Error",error)
        }
    },
    sendPassword: async function(mailDetails, result){
      try{
        console.log("mail passowrd")
      let subject = "First Time Password Mail";
      let mailBody = await mailBodyGenerate('firstTimePassword',mailDetails);
      sendEmail(mailDetails.email,subject,mailBody);
      } catch(error){
          console.log("Error",error)
      }
    },
}

module.exports = service;

