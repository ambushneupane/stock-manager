const BASE_URL=process.env.STOCK_API_BASE
async function fetchStockPrice(stockName){
    try{
        const mainURL=`${BASE_URL}${stockName}`
        const response=await fetch(mainURL);
        if(!response.ok){
            // throw new Error('Failed to Fetch dataStatus:', response.status)
            return null;
        }
        const data= await response.json()
       
        const chartValue = data?.response?.ltp;
    
        return chartValue
    }catch(error){
        console.error('Error',error.message);
        return null;
    }
 
    
}

module.exports=fetchStockPrice;