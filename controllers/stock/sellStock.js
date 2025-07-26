const Stock= require('../../models/stock.js')
const asyncWrapper=require('../../middleware/asyncHandler.js');
const { BadRequestError, NotFoundError} = require('../../errors/index.js');
const {sellStockSchema}=require('../../validators/stockValidator.js');
const sellTransaction = require('../../models/sellTransaction.js');

const sellStock= asyncWrapper(async(req,res)=>{
    const body=req.body||{}
    const {name,sellPrice,quantity}=body;

   const {error,value}=sellStockSchema.validate(body);
   if (error){
    throw new BadRequestError(error.details[0].message)
    }
    
    // console.log('User ID:', req.user?.userId);

    const stock=await Stock.findOne({
        name:{$regex:`${value.name}$`,$options:'i'},
        user:req.user.userId
    })

    if (!stock) {
        throw new NotFoundError('Stock not found');
        }

      // check if user has enough quantity to sell  
    if(stock.units<quantity){
        throw new BadRequestError('Not enough Stock units to sell');
    }
    const totalBuyPrice=stock.price*quantity;
    const totalSellPrice= sellPrice*quantity;
    
    const profitOrLoss= totalSellPrice-totalBuyPrice;
    const profitOrLossPercent=((profitOrLoss/totalBuyPrice)*100).toFixed(2);;

    //updating stock remaning units
    stock.units-=quantity;

    if(stock.units===0){
        await stock.deleteOne(); //Remove stock if no units are left
    }else{
        await stock.save(); 
    }

    const dataToSave={
        stock:stock._id,
        stockName:stock.name,
        user:req.user.userId,
        unitsSold:quantity,
        sellingPrice:sellPrice,
        buyPrice:stock.price,
    }
    if(profitOrLoss>0){
        dataToSave.profitAmount=profitOrLoss;
        dataToSave.profitPercent=profitOrLossPercent;

    }else if(profitOrLoss<0){
        dataToSave.lossAmount=Math.abs(profitOrLoss);
        dataToSave.lossPercent=Math.abs(profitOrLossPercent);
    }else {
        dataToSave.profitAmount=0;
        dataToSave.profitPercent=0;
    }
    
    //Saving Sell Transactions.
    await sellTransaction.create(dataToSave)



    const responseData={
        name:name.toUpperCase(),
        quantity,
        sellPrice,
        totalSellPrice,
        totalBuyPrice,
    }
    if(profitOrLoss>0){
        responseData.profit= profitOrLoss;
        responseData.profitPercent= profitOrLossPercent;
    }else if(profitOrLoss<0){
        responseData.loss=Math.abs(profitOrLoss);
        responseData.lossPercent=Math.abs(profitOrLossPercent);
    }else if (profitOrLoss===0){
        responseData.profit=profitOrLoss;
        responseData.profitPercent=profitOrLossPercent;
    }else{
        responseData.message="Something error occured!"
    }

    res.status(200).json({
    message: 'Stock sold successfully',
    data: responseData
  });
     
})

module.exports=sellStock;