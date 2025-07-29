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


//ROUTES

app.use('/api/stocks',stockRoutes);
app.use('/api/users',userRoutes);
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`Welcome to the Stock Manager API.
  
  This backend service helps you track, manage, and analyze your stock investments.
  
  To get started:
  
  - Register a new user at POST /api/users/register
  - Login at POST /api/users/login
  - Explore stocks API under /api/stocks/
  
  Use a tool like Postman or your frontend app to interact with this API.`);
  });
  
  

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