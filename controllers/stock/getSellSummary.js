const asyncWrapper=require('../../middleware/asyncHandler');
const SellTransaction=require('../../models/sellTransaction');


const getSellSummary= asyncWrapper(async(req,res)=>{
    const transactions=await SellTransaction.find({user:req.user.userId});
    // console.log(transactions);

    const summaryMap= new Map();

    for(let txn of transactions){
        const stockId=txn.stock?.toString()|| txn.stockName;
        // console.log(stockId)
        if(!summaryMap.has(stockId)){
            summaryMap.set(stockId,{
                stock:txn.stockName || 'Unknown',
                totalUnitsSold:0,
                totalSellAmount:0,
                totalCostOfSoldUnits:0,
            })

        }
        const item=summaryMap.get(stockId);
        // console.log('Item:',item)
        item.totalUnitsSold+=txn.unitsSold
        item.totalSellAmount+= txn.sellingPrice*txn.unitsSold
        item.totalCostOfSoldUnits+= txn.buyPrice * txn.unitsSold // // Accumulate the total original purchase cost for all units sold in these transactions
        
    }
    const summary=[];

    for(let item of summaryMap.values()){
        const{totalSellAmount,totalCostOfSoldUnits}=item;
        const profitOrLossAmount = totalSellAmount-totalCostOfSoldUnits;
        const profitOrLossPercent= totalCostOfSoldUnits? (profitOrLossAmount/totalCostOfSoldUnits)*100 :0;
    
        const entry={
            stock:item.stock,
            totalUnitsSold:item.totalUnitsSold,
            totalSellAmount:item.totalSellAmount,
        }
        if(profitOrLossAmount>0){
            entry.profitAmount=profitOrLossAmount;
            entry.profitOrLossPercent=Number(profitOrLossPercent.toFixed(2))
        }else if (profitOrLossAmount<0){
            entry.lossAmount=Math.abs(profitOrLossAmount)
            entry.lossPercent=Math.abs(Number(profitOrLossPercent.toFixed(2)))
        }else{
            entry.profitAmount=0;
            entry.profitpercent=0;
        }
        summary.push(entry)
    }


    res.status(200).json({
            count: summary.length,
            summary,
        });
    

})





module.exports = getSellSummary;