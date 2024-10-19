const express = require('express');
const app = express();

const morgan = require('morgan');
//////////////////////
//IMPORT ROUTE
/////////////////////
const tourRouter = require('../routes/tourRoutes');
const userRouter = require('../routes/userRoutes');

//////////////////////////
//Middleware
//////////////////////////
app.use(express.json()); // body-parcer
app.use(morgan('dev')); // request-parcer
////////////////////////////
//Custom-Middleware : applies to every request
////////////////////////////
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestime = new Date().toISOString();
  next();
});
////////////////////////////
//USE ROUTE AS MIDDLEWARES
///////////////////////////
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

///////////////////////////////////////
//START SERVER : Move to 'server.js' file
//To seperate server from express app()
///////////////////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
