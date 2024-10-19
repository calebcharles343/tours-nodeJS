const express = require('express');
const app = express();

const morgan = require('morgan');
//////////////////////
//IMPORT ROUTE
/////////////////////
const AppError = require('./utils/appError');
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
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`
  // });
  //////////////////////////////////////////////////////////////////////////
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  /* Express assumes that any passed into next is an Error */
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//EXPRESS GLOBAL ERROR HANDLING : EXPORTED TO 'controllers/errorController.js'
app.use((err, req, res, next) => {
  // console.log(err.stack); // To see where error occured

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
//export express to server
module.exports = app;
