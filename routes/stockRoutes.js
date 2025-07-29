const express=require('express');
const router= express.Router()
const stockController= require('../controllers/stock');

const auth=require('../middleware/auth.js')

router.use(auth) //PROTECTED

router.get('/all',stockController.getAllStocks); // curl http://localhost:3000/api/stocks/all

router.get('/summary',stockController.getSummary);



router.post('/add',stockController.addStock); 
/*

curl -X POST http://localhost:3000/api/stocks/add \
-H "Content-Type: application/json" \
-d '{"name":"NABIL", "price": 550, "units": 100}'

*/


router.patch('/update/:id',stockController.updateStock)
/*
curl -X PATCH http://localhost:3000/api/stocks/update/6863c6277bc21c33d44b2c3c \
-H "Content-Type: application/json" \
-d '{"price": 600, "units": 150}'
*/

//HAS Plan executor error during findAndModify bug 


router.delete('/delete/:id',stockController.deleteStock)
//curl -X DELETE http://localhost:3000/api/stocks/delete/<id>


router.post('/sell',stockController.sellStock);

router.get('/sell-history',stockController.getSellTransaction);

router.get('/sell-summary',stockController.getSellSummary)

router.get('/export/current-stocks/csv',stockController.exportStocksCSV)

router.get('/export/current-stocks/pdf',stockController.exportStocksPDF)

module.exports=router;