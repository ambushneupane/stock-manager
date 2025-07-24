const Stock= require('../../models/stock.js')
const asyncWrapper=require('../../middleware/asyncHandler.js');
const { BadRequestError } = require('../../errors/index.js');
const {addStockSchema}=require('../../validators/stockValidator.js')

const addStock= asyncWrapper(async (req,res)=>{
   //Validate Input with JOI
   const body = req.body || {};
   const {error,value}=addStockSchema.validate(body);
   if (error){
   throw new BadRequestError(error.details[0].message)
   }
    const {name,price,units}=value;
    const upperCaseName=name.toUpperCase();

    const existing= await Stock.findOne({
        name:upperCaseName,
        user: req.user.userId 
    })
    if(existing){
        throw new BadRequestError('Stock with that name already exists!')
    }
    const newStock=await Stock.create({name:upperCaseName,price,units,user: req.user.userId,});
    res.status(201).json({
        msg:'Stock added Successfully',
        stock:newStock
    })
})

module.exports=addStock