const Stock= require('../../models/stock.js')
const asyncWrapper=require('../../middleware/asyncHandler.js');
const { BadRequestError } = require('../../errors/index.js');

const getAllStocks=asyncWrapper(async (req,res)=>{
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

module.exports=getAllStocks