const CustomAPIError=require('./customError');

class NotFoundError extends CustomAPIError{
    constructor(message){
        super(message||'Not Found' ,404 )
    }
}

module.exports=NotFoundError;
