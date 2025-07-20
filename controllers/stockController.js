const Stock=require('../models/stock.js')
const asyncWrapper=require('../middleware/asyncHandler.js');
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors/index.js');
const { addStockSchema,updateStockSchema } = require('../validators/stockValidator');
const checkStockOwnership = require('../utils/checkOwnership');
const { ObjectId } = require('mongoose').Types;

exports.updateStock = asyncWrapper(async (req, res) => {
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


exports.getAllStocks=asyncWrapper(async (req,res)=>{
        const {name,minPrice,maxPrice,sort,fields}=req.query;
        
        //FILTERING
        const queryObject={user:req.user.userId};

        if(name){
            queryObject.name={$regex:`^${name}$`,$options:'i'};
        }

       if(minPrice || maxPrice){
        queryObject.price={};
        if (minPrice){
            queryObject.price.$gte=Number(minPrice);
        }
        if (maxPrice){
            queryObject.price.$lte=Number(maxPrice);
        }
       }

       //SORTING

       let result = Stock.find(queryObject);

       if(sort){
        const sortList=sort.split(',').join(' ');
        result=result.sort(sortList);
       }else{
        result=result.sort('-createdAt');
       }
       
       // Field selectoin
       const allowedFields=[
        'name',
        'price',
        'units',
        'createdAt'
       ]
     
       if(fields){
        const requestedFields=fields.split(',').map(f=>f.trim());
         //strip leading - or + from field names
         const cleanedFields=requestedFields.map(f=>f.replace(/^[-+]/,'').trim())

        const invalidFields=cleanedFields.filter(f=>!allowedFields.includes(f));// array with invalid fields
        
        if(invalidFields.length>0){
           throw new BadRequestError('Query contains invalid Fields!') 
        }
        const selectedFields= requestedFields.join(' ');
        result=result.select(selectedFields).lean({virtuals:false})
       }

      if(req.query.page||req.query.skip)
        { 
            const page=Number(req.query.page)|| 1;
       const limit=Number(req.query.limit)|| 4;

       const skip = (page-1)*limit
       
       result= result.skip(skip).limit(limit)
    }
       const stocks= await result;
        res.status(200).json({
            message:'Stocks Retrieved Successfully',
            count:stocks.length,
            data:stocks
        });
    
})

//curl -X GET http://localhost:3000/api/stocks?name=hrL

exports.getStockByName= asyncWrapper(async (req,res)=>{
const {name}= req.query;

if(!name){
    throw new BadRequestError('Please Provide a stock Name')
}
const stock=await Stock.findOne({
    name:{$regex:name,$options:'i'},
    user:req.user.userId
})
if (!stock) {
    throw new NotFoundError(`No stock found with name '${name}'`);  }

  res.status(200).json(stock);
})


exports.addStock=asyncWrapper(async (req,res)=>{
   //Validate Input with JOI

   const {error,value}=addStockSchema.validate(req.body);
   if (error){
   throw new BadRequestError(error.details[0].message)
   }
    const {name,price,units}=value;
    
    const existing= await Stock.findOne({
        name,
        user: req.user.userId 
    })
    if(existing){
        throw new BadRequestError('Stock with that name already exists!')
    }
    const newStock=await Stock.create({name,price,units,user: req.user.userId,});
    res.status(201).json({
        msg:'Stock added Successfully',
        stock:newStock
    })
})


exports.deleteStock=asyncWrapper(async(req,res)=>{
    const {id:stockId}= req.params;
    // console.log(stockId);
    const stock =await checkStockOwnership(stockId,req.user.userId)
    await stock.deleteOne();

     res.status(200).json({
        msg: `Stock '${stock.name}' deleted successfully.`,
        deleted:stock,
      });

    })


//Aggregation Pipeline
exports.getSummary=asyncWrapper(async(req,res)=>{
    
    const summary= await Stock.aggregate([
        {
            $match:{
                user: new ObjectId(req.user.userId)
            }
        },
        {
            $group:{
                _id:null, //Combine all documentsinto one group
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
    const data= summary[0]||{totalInvestment:0};
    res.status(200).json(data);

})
