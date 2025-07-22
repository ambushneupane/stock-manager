const Stock= require('../../models/stock.js')
const asyncWrapper=require('../../middleware/asyncHandler.js');
const mongoose = require('mongoose');
const getSummary= asyncWrapper(async(req,res)=>{
    
    const summary= await Stock.aggregate([
        {
            $match:{
                user: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group:{
                _id:null, //Combine all documents into one group
                totalInvestment:{
                    $sum:{
                        $multiply:["$price","$units"]
                    }
                },
                totalStocks:{$sum:1},
                totalUnits:{$sum:"$units"}
                
            }
        },
        {
            $project:{
                _id:0,
                totalInvestment:1,
                totalStocks:1,
                totalUnits:1
            }
        }
    ])
    const data= summary[0]||{
        totalInvestment:0,
        totalStocks: 0,
        totalUnits: 0,

    };
    res.status(200).json(data);

})


module.exports=getSummary