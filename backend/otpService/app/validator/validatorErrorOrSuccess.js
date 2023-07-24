const { validationResult } = require('express-validator');

module.exports.Validation = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({
            status: 'failure',
            response: errors.array()
        })
    }
    next();
}