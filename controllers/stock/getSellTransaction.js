const asyncWrapper = require("../../middleware/asyncHandler");
const sellTransaction=require('../../models/sellTransaction');

const getSellTransaction=asyncWrapper (async(req,res)=>{
    
    const transactions= await sellTransaction.find({user:req.user.userId})
    // console.log(transactions)
    res.status(200).json({
        count:transactions.length,
        transactions
    })
}   
)

module.exports=getSellTransaction;