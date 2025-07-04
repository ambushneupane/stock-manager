const Stock=require('../models/stock.js')
const asyncWrapper=require('../middleware/asyncHandler.js');
const { BadRequestError, NotFoundError } = require('../errors/index.js');
const { addStockSchema,updateStockSchema } = require('../validators/stockValidator');

exports.getAllStocks=asyncWrapper(async (req,res)=>{
        const {name,minPrice,maxPrice,sort,fields}=req.query;
        
        //FILTERING
        const queryObject={};

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
        const requestedFields=fields.split(',').map(f=>f.toLowerCase());
        const invalidFields=requestedFields.filter(f=>!allowedFields.includes(f));// array with invalid fields
        
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


//Aggregation Pipeline
exports.getSummary=asyncWrapper(async(req,res)=>{
    const summary= await Stock.aggregate([
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