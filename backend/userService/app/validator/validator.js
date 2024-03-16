const { check } = require('express-validator');

module.exports.validate = (validateParams) => {
    switch (validateParams) {
        case 'login':
            return [
                check('secondary', 'Token is Required').exists({ checkFalsy: true }).trim(),
                check('loginId', 'Email Address Required').exists({ checkFalsy: true }).trim().escape()
                    .isEmail().withMessage('Invalid Email Addess'),
                check('password', 'Password Required').exists({ checkFalsy: true }).trim().escape(),
                check('captchaToken', 'Captcha Required').exists({ checkFalsy: true }).trim(),
                check('otp', 'OTP Required').exists({ checkFalsy: true}).trim()
            ];
        case 'registerUser':
            return [
                check('secondary', 'Token is Required').exists({ checkFalsy: true }).trim(),
                check('firstName')
                    .notEmpty().withMessage('First name is required.')
                    .trim()
                    .isLength({ min: 3, max: 256 }).withMessage('First name must be between 3 and 256 characters.'),

                check('lastName')
                    .notEmpty().withMessage('Last name is required.')
                    .trim()
                    .isLength({ min: 3, max: 256 }).withMessage('Last name must be between 3 and 256 characters.'),

                check('email')
                    .notEmpty().withMessage('Email address is required.')
                    .trim()
                    .isEmail().withMessage('Invalid email address.'),

                check('countryCode')
                    .notEmpty().withMessage('Country code is required.')
                    .trim(),

                check('mobileNumber')
                    .notEmpty().withMessage('Mobile number is required.')
                    .trim(),

                check('requestReason')
                    .notEmpty().withMessage('Request reason is required.')
                    .trim()
                    .isLength({ min: 8, max: 256 }).withMessage('Request reason must be between 8 and 256 characters.')
            ];
    }
}