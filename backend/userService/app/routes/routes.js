const express = require('express')
const userController = require('../controller/controller.js')
const router = express.Router();

router.route('/user')
      .get(userController.getAllUsers)

module.exports = router