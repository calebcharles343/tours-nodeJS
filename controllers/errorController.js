/////////////////////////////////////////////////
//EXPRESS GLOBAL ERROR HANDLING
////////////////////////////////////////////////

const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  console.log(err.path);
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  // const value = err.keyValue.match(/(["'])(\\?.)*?\1/)[0];
  const value = err.keyValue.name; // Fix by charles

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  // Object.values(obj).map() to loop over element of an object
  // console.log('Object.values:', Object.values(err.errors));
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
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
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
      // message: `Invalid ${err.path}: ${err.value}.`
    });
  }
};

/* global error handler */
module.exports = (err, req, res, next) => {
  // console.log(err.stack); show where error occured

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };

    if (error.name === 'CastError' || err.kind === 'ObjectId')
      error = handleCastErrorDB(error); // Fix by Charles
    // if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (
      error.name === 'ValidationError' ||
      error._message === 'Validation failed'
    )
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
  next();
};
