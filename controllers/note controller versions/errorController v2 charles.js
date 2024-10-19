/////////////////////////////////////////////////
//EXPRESS GLOBAL ERROR HANDLING
////////////////////////////////////////////////

const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    //Operational, trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error:we don't want to leak error details
    //1) log error
    console.error('ERROR ❌', err);
    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

//EXPRESS GLOBAL ERROR HANDLING
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('prod err');
    let error = { ...err }; //create a hardcopy of the 'err' object
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // sendErrorProd(err, res);
    sendErrorProd(error, res);
  }
};
