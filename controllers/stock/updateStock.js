const Stock= require('../../models/stock.js')
const asyncWrapper=require('../../middleware/asyncHandler.js');
const { BadRequestError } = require('../../errors/index.js');
const checkStockOwnership=require('../../utils/checkOwnership.js');
const {updateStockSchema}= require('../../validators/stockValidator.js')

const updateStock= asyncWrapper(async (req, res) => {
  const { id: stockId } = req.params;

  await checkStockOwnership(stockId, req.user.userId); //FIXES IDOR

  const { error, value } = updateStockSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const updated = await Stock.findByIdAndUpdate(stockId, value, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ msg: 'Stock updated successfully', stock: updated });
});

module.exports=updateStock