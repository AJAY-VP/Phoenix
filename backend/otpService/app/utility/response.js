class ResponseHandler {
    static success(res, data, statusCode = 200) {
      return res.status(statusCode).send({
        status: 'success',
        response: data,
      });
    }
  
    static error(res, response = 'Internal Server Error', statusCode = 500) {
      return res.status(statusCode).send({
        status: 'error',
        response,
      });
    }
  
    static custom(res, status, response = 'Some Error Occured', statusCode = 500) {
      return res.status(statusCode).send({
        status,
        response,
      });
    }
  }
  
  module.exports = ResponseHandler;
  