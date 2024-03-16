const express = require('express');
const otpController = require('../controller/controller.js');
const validation = require('../validator/validator.js')
const successValidation = require('../validator/validatorErrorOrSuccess.js');
const tokenValidation = require('../validator/tokenValidation.js');
// eslint-disable-next-line new-cap
const router = express.Router();

router.route('/api/otpService/v1/getOtp')
    .get(validation.validate('getOtp'),successValidation.Validation,tokenValidation.validateToken,otpController.getOtp);

module.exports = router;
