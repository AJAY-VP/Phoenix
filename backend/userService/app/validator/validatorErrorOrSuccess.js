const {validationResult} = require('express-validator');
const responseHandler = require('../utility/response.js');

module.exports.Validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    responseHandler(res, 'failure', errors.array(), 422);
  }
  next();
};
