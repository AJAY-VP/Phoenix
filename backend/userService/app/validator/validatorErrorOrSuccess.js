const { validationResult } = require('express-validator');
const ResponseHandler = require('../utility/response.js');

module.exports.Validation = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        ResponseHandler(res,'failure',errors.array(),422);
    }
    next();
}