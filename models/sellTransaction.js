const mongoose=require('mongoose');


const sellTransactionSchema= new mongoose.Schema({
    stock:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stock',
        required:true
    },
    stockName:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    unitsSold:{
        type:Number,
        required:true,
        min:[1,'Must Sell at Least 1 unit']
    },  
    sellingPrice:{
        type:Number,
        required:true,
        min:[0,'Price Must Be Positive']
    },
    buyPrice:{
        type:Number,
        required:true
    },
    profitAmount:{
        type:Number
    },
    profitPercent:{
        type:Number
    },
    lossAmount:{
        type:Number
    },
    lossPercent:{
        type:Number
    },
    soldAt:{
        type:Date,
        default:Date.now
    }

})
module.exports= mongoose.model('SellTransation',sellTransactionSchema)