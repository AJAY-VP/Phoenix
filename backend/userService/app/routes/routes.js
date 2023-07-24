const express = require('express');
const userController = require('../controller/controller.js');
const validation = require('../validator/validator.js')
const successValidation = require('../validator/validatorErrorOrSuccess.js');
// eslint-disable-next-line new-cap
const router = express.Router();

router.route('/api/userService/v1/user')
    .get(userController.getAllUsers);

router.route('/api/userService/v1/login')
    .post(validation.validate('login'),successValidation.Validation,userController.login);

router.route('/api/userService/v1/registerUser')
    .post(validation.validate('registerUser'),successValidation.Validation,userController.registerUser);

module.exports = router;
