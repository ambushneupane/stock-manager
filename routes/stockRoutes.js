const express=require('express');
const router= express.Router()
const stockController= require('../controllers/stockController.js');

router.get('',stockController.getStockByName)
router.get('/all',stockController.getAllStocks);

router.post('/add',stockController.addStock);
router.patch('/update/:id',stockController.updateStock)

router.delete('/delete/:id',stockController.deleteStock)




module.exports=router;