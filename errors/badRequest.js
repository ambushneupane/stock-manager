const CustomAPIError=require('./customError')

class BadRequestError extends CustomAPIError{
    constructor(message){
        super(message || 'Bad Request',400);
    }
}

module.exports= BadRequestError;