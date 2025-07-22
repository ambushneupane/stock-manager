const asyncWrapper=require('../../middleware/asyncHandler.js');
const checkStockOwnership=require('../../utils/checkOwnership.js');

const deleteStock= asyncWrapper(async(req,res)=>{
    const {id:stockId}= req.params;
    // console.log(stockId);
    const stock =await checkStockOwnership(stockId,req.user.userId)
    await stock.deleteOne();

     res.status(200).json({
        msg: `Stock '${stock.name}' deleted successfully.`,
        deleted:stock,
      });

    })


module.exports=deleteStock