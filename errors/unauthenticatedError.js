const CustomAPIError=require('./customError');

class UnauthenticatedError extends CustomAPIError{
    constructor(message){
        super(message || 'Unauthenticated To Perform the Action',401)
    }
}


module.exports=UnauthenticatedError;
