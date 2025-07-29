const PDFDocument=require('pdfkit');

const fs=require('fs');

const path=require('path');
const Stock=require('../../../models/stock');
const asyncWrapper=require('../../../middleware/asyncHandler');

const exportStocksPDF= asyncWrapper(async (req,res)=>{
    const stock =await Stock.find({user:req.user.userId});
    const doc= new PDFDocument();
    const fileName=`stocks${Date.now()}.pdf`;
    const filePath=path.join(__dirname,'.././../exports',fileName)
    console.log(filePath);
})

module.exports=exportStocksPDF;