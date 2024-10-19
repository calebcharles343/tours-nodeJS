const express = require('express');
const app = express();

const morgan = require('morgan');

//////////////////////////
//IMPORT ERROR HANDLERS
//////////////////////////
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//////////////////////
//IMPORT ROUTE
/////////////////////
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//////////////////////////
//Middleware
//////////////////////////
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // body-parcer
// app.use(morgan('dev')); // request-parcer
app.use(express.static(`${__dirname}/public`)); // for serving static files to browser: e.g. http://localhost:3000/overview.html

////////////////////////////
//Custom-Middleware : applies to every request
////////////////////////////
/*
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});
*/

app.use((req, res, next) => {
  req.requestime = new Date().toISOString();
  // console.log(x);
  next();
});
////////////////////////////
//USE ROUTE AS MIDDLEWARES
///////////////////////////
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//////////////////////////////////////////
//ERROR HANDLING
//////////////////////////////////////////

//INCORRECT URL REQUEST
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//EXPRESS GLOBAL ERROR HANDLING
app.use(globalErrorHandler);

//export express to server
module.exports = app;
