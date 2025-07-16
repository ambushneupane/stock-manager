const CustomAPIError=require('../errors/customError');

const errorHandlerMiddleware=(err,req,res,next)=>{
    //handles JSON parse error
    if (err.type==='entity.parse.failed'){
    return res.status(400).json({
        msg:'Invalid JSON Payload'
    })
   }
    //Handle known custom errors
    if (err instanceof CustomAPIError){
        return res.status(err.statusCode).json({msg:err.message})
    }

    if (err.name==='ValidationError'){
        const messages=Object.values(err.errors).map(e=>e.message);
        return res.status(400).json({msg:messages.join(', ')})
    }
    console.log(err);
    

    return res.status(500).json({
        
        msg:'Something went Wrong, Try again Later!'
        
    })
}

module.exports=errorHandlerMiddleware;