const asyncWrapper=(fn)=>{
    return async(req,res,next)=>{
        try{
            await fn(req,res,next);
        }catch(err){
            // console.error('Error here',err)
            next(err)
        }
    }

}


module.exports=asyncWrapper