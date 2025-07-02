const Stock=require('../models/stock.js')
const asyncWrapper=require('../middleware/asyncHandler.js');
const { BadRequestError, NotFoundError } = require('../errors/index.js');
const { addStockSchema,updateStockSchema } = require('../validators/stockValidator');
const CustomAPIError = require('../errors/customError.js');

exports.getAllStocks=asyncWrapper(async (req,res)=>{
   
        const stocks= await Stock.find({});
        res.status(200).json(stocks);
    
})

//curl -X GET http://localhost:3000/api/stocks?name=hrL

exports.getStockByName= asyncWrapper(async (req,res)=>{
const {name}= req.query;

if(!name){
    throw new BadRequestError('Please Provide a stock Name')
}
const stock=await Stock.findOne({name:{$regex:name,$options:'i'}})
if (!stock) {
    return res.status(404).json({ msg: `No stock found with name '${name}'` });
  }

  res.status(200).json(stock);
})


exports.addStock=asyncWrapper(async (req,res)=>{
   //Validate Input with JOI

   const {error,value}=addStockSchema.validate(req.body);
   if (error){
   throw new BadRequestError(error.details[0].message)
   }
    const {name,price,units}=value;
    
    const existing= await Stock.findOne({name})
    if(existing){
        throw new BadRequestError('Stock with that name already exists!')
    }
    const newStock=await Stock.create({name,price,units});
    res.status(201).json({
        msg:'Stock added Successfully',
        stock:newStock
    })
})

exports.updateStock=asyncWrapper(async(req,res)=>{
const {id:stockId}=req.params;
const {error,value}=updateStockSchema.validate(req.body)
if(error){
    throw new BadRequestError(error.details[0].message);
}
const updated= await Stock.findByIdAndUpdate(stockId,value,{
    new:true,
    runValidators:true
})
if (!updated) {
    throw new NotFoundError('Stock with that id not found!');
}

res.status(200).json({ msg: 'Stock updated successfully', stock: updated });
})

exports.deleteStock=asyncWrapper(async(req,res)=>{
    const {id:stockId}= req.params;
    // console.log(stockId);
    const deletedStock=await Stock.findByIdAndDelete(stockId);
    if(!deletedStock){
        throw new NotFoundError('Stock with that id not found!')
    }
     res.status(200).json({
        msg: `Stock '${deletedStock.name}' deleted successfully.`,
        deleted:deletedStock,
      });

})