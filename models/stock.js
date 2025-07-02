const mongoose=require('mongoose');

const stockSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        unique:true
    },
    price:{
        type:Number,
        required:[true,'Price is required'],
        min:[0.01,'Price must be greater than 0'],
    },
    units:{
        type:Number,
        required:[true,'Units are required'],
        min:[1,'Units must be at least 1']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

    }
)

module.exports=mongoose.model('Stock',stockSchema)