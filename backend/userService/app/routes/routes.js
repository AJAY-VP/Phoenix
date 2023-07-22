const express = require('express');
const userController = require('../controller/controller.js');
// eslint-disable-next-line new-cap
const router = express.Router();

router.route('/api/userService/user')
    .get(userController.getAllUsers);

module.exports = router;
