const { check } = require('express-validator');

module.exports.validate = (validateParams) => {
    switch (validateParams) {
        case 'getOtp':
            return [
                check('secondary', 'Token is Required').exists({ checkFalsy: true }).trim(),
                check('loginId', 'Email Address Required').exists({ checkFalsy: true }).trim().escape()
                    .isEmail().withMessage('Invalid Email Addess')
            ];
    }
}