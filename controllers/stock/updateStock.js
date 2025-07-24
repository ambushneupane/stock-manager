const Stock= require('../../models/stock.js')
const asyncWrapper=require('../../middleware/asyncHandler.js');
const { BadRequestError, NotFoundError } = require('../../errors/index.js');
const checkStockOwnership=require('../../utils/checkOwnership.js');
const {updateStockSchema}= require('../../validators/stockValidator.js')

const updateStock= asyncWrapper(async (req, res) => {
  const { id: stockId } = req.params;

  await checkStockOwnership(stockId, req.user.userId); //FIXES IDOR

  const { error, value } = updateStockSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  
  if(value.name){
    value.name= value.name.toUpperCase();
  }

  const existing=await Stock.findOne({
    user:req.user.userId,
    name:value.name,
    _id: { $ne: stockId } // Exclude the current stock from the duplicate name check

  })
  if (existing){
    throw new BadRequestError("Stock with this name already Exists")
  }


  try{
    const updated = await Stock.findByIdAndUpdate(stockId, value, {
    new: true,
    runValidators: true,
  });
  if(!updated){
    throw new NotFoundError("Stock Not FOUND")
  }
  res.status(200).json({ msg: 'Stock updated successfully', stock: updated });
}catch(err){
  if(err.code===11000){
    throw new BadRequestError("You Already Have a stock with this Name")
  }
  throw err;
}
});

module.exports=updateStock