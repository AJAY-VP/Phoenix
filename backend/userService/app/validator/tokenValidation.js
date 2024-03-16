const config = require('../config/config.json');
const secToken = config.secToken;
const secTokenExp = config.secTokenExp;
const ResponseHandler = require('../utility/response.js');
const crypto = require('crypto-js');

function extractToken(req){
    return new Promise((resolve,reject) => {
        try{
            req.token = {
                auth: req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined,
                sec: req.headers['secondary'].split(' ')[1]
            }
            resolve('done');
        } catch(error){
            return reject('Extraction error');
        }
    });
}

module.exports.validateToken = (req,res,next) => {
    try{
        extractToken(req)
        .then(() => {
            try{
            const decrypted = JSON.parse(crypto.AES.decrypt(req.token.sec, secToken).toString(crypto.enc.Utf8));
            const date1 = new Date(decrypted.timestamp);
            const currentTimestamp = new Date().toISOString();
            const date2 = new Date(currentTimestamp);
            const timeDifferenceInSecs = (Math.abs(date2 - date1))/1000;
            console.log('timediff : ',timeDifferenceInSecs);
            if(timeDifferenceInSecs < 5){   
                next();
            }
            else{
                ResponseHandler.custom(res,'error','Token error',403);
            }
            } catch(error){
                console.log(error);
                ResponseHandler.custom(res,'error','Token error',403);
            }
        })
        .catch((err) => {
            ResponseHandler.custom(res,'error','Token error',403);
        })
    } catch(error){
        ResponseHandler.custom(res,'error','Token error',403);
    }
}