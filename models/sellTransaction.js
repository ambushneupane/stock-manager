const mongoose=require('mongoose');


const sellTransactionSchema= new mongoose.Schema({
    stock:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stock',
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
    plAmount:{
        type:Number,
        required:true
    },
    plPercent:{
        type:Number,
        required:true
    },
    soldAt:{
        type:Date,
        default:Date.now
    }

})
module.exports= mongoose.model('SellTransation',sellTransactionSchema)