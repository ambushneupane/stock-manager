const {Parser}= require('json2csv');
const Stock= require('../../../models/stock.js');
const asyncWrapper=require('../../../middleware/asyncHandler.js');


const exportStocksCSV=asyncWrapper(async (req,res)=>{
    const stocks= await Stock.find({user:req.user.userId});
    
    if (stocks.length===0){
        return res.status(404).json({msg:'No stocks found to export'});
    }

    const fields=['name','price','units','createdAt','investment']
    const parser= new Parser({fields});
    
    //converting Data to CSV format
    const csv= parser.parse(stocks);
    res.header('Content-Type', 'text/csv');
    res.attachment('stocks.csv');
    return res.send(csv);

})

module.exports=exportStocksCSV;
