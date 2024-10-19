class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //initailize parent class to access error behaviour

    this.statusCode = statusCode;
    /* status starts with 4 = client error (fail) and if not = server errors*/
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Errors we created ourselfs

    // ensure stack trace does not include the AppError constructor itself
    // but starts from where the actual error occurred.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
