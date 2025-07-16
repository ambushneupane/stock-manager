const Stock=require('../models/stock');
const { NotFoundError, UnauthenticatedError } = require('../errors');

const checkStockOwnership= async (stockId,userId)=>{
    const stock=await Stock.findById(stockId);
    if(!stock){
        throw new NotFoundError(`Stock not found`);
    }
    if(stock.user.toString()!== userId){
        throw new UnauthenticatedError(`Not Authorized to acess this Stock`);
    }
    return stock;
}
module.exports = checkStockOwnership;