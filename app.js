require('dotenv').config()

const express= require('express');
const port=process.env.PORT|| 3000;


const connectDB=require('./database/connect');

const stockRoutes=require('./routes/stockRoutes')
const userRoutes=require('./routes/userRoutes')
const notFound=require('./middleware/not-found');
const errorHandlerMiddleware=require('./middleware/error-handler')

const app=express();
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json'); // or wherever your swagger doc is


//ROUTES

app.use('/api/stocks',stockRoutes);
app.use('/api/users',userRoutes);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//404
app.use(notFound)
app.use(errorHandlerMiddleware)

const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=> console.log(`Server is runing on port:${port}`));
    }
    catch(err){
        console.error(err);
    }
}
start();