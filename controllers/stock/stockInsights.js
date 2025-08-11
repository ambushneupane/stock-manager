const asyncWrapper=require('../../middleware/asyncHandler.js');
const Stock=require('../../models/stock.js');
const fetchStockPrice = require('../../utils/fetchStock.js');

const getStockInsights= asyncWrapper(async (req,res)=>{
    const stocks= await Stock.find({user:req.user.userId});
    if (stocks.length===0){
        return res.status(200).json({
            message:'No Stocks in portfolio',
            insights:{
                totalInvestment:0,
                totalCurrentValue:0,
                totalProfitOrLoss:0,
                overallPercent:'0%',
                topGainer:null,
                topLoser:null
            }
        })
    }
    
    const enriched=[];
    let totalInvestment=0
    let totalCurrentValue=0

    let currentValue=null
    for (const stock of stocks){
        
    let profitPercent = null;
    let lossPercent = null;

        const currentPrice= await fetchStockPrice(stock.name);
        const investment= stock.price*stock.units;
        totalInvestment += investment;


        if(currentPrice!==null){
        currentValue = currentPrice * stock.units;
        totalCurrentValue += currentValue;
        
        const percent = ((currentPrice-stock.price)/stock.price)*100;
       
        
        if(percent>0) profitPercent=percent.toFixed(2)+"%";
        else if(percent<0) lossPercent=percent.toFixed(2)+"%";
        else profitPercent=lossPercent='0%';
    }
    else{
        currentValue= investment;
        totalCurrentValue+= currentValue;
    }
    const enrichedStock={
        name:stock.name,
        buyPrice:stock.price,
        investment:investment.toFixed(2),
        currentPrice:currentPrice??null,
    }
    if(profitPercent){ 
        enrichedStock.profitPercent=profitPercent
        enrichedStock.profitAmount=(currentValue-investment).toFixed(2)
    }
    else if(lossPercent){ 
        enrichedStock.lossPercent=lossPercent;
        enrichedStock.lossAmount= Math.abs(currentValue-investment).toFixed(2)
    }
    enriched.push(enrichedStock)

    }
    const totalProfitOrLoss= totalCurrentValue - totalInvestment;
    const overallPercent = ((totalProfitOrLoss / totalInvestment) * 100).toFixed(2) + '%';
        
    const validGainers = enriched.filter(stock => stock.currentPrice !== null && stock.profitPercent !== undefined);
const validLosers = enriched.filter(stock => stock.currentPrice !== null && stock.lossPercent !== undefined);

    const topGainer = validGainers.reduce((max,stock)=>{
        const val=parseFloat(stock.profitPercent)||0;
        const maxVal=parseFloat(max.profitPercent) ||0;
        return val >maxVal?stock:max;

    },{profitPercent:'0%'})


    const topLoser= validLosers.reduce((min,stock)=>{
        const val=parseFloat(stock.lossPercent) || 0;
        const minVal= parseFloat(min.lossPercent) || 0

        return minVal > val? stock:min;
    },{lossPercent:'0%'})
    

    res.status(200).json({
        insights:{
            totalInvestment:totalInvestment.toFixed(2),
            totalCurrentValue:totalCurrentValue.toFixed(2),
            totalProfitOrLoss:totalProfitOrLoss.toFixed(2),
            overallPercent,
            topGainer:topGainer.profitPercent==='0%'?null:topGainer,
            topLoser:topLoser.lossPercent==='0%'?null:topLoser
            
        }
    })


     
})

module.exports=getStockInsights