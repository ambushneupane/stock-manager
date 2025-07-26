const mongoose=require('mongoose');

const stockSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
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
    },
    // ADDING USER Refrence 
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

    },{
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
);
stockSchema.index({ user: 1, name: 1 }, { unique: true });

// stockSchema.index({ user: 1, name: 1 }, { unique: true });
stockSchema.virtual('investment').get(function(){
    return this.price*this.units;
}) // Can't use arrow functions as we need to use `this` inside the function



module.exports=mongoose.model('Stock',stockSchema)