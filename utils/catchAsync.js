//////////////////////////////////////////
// ASYNC AWAIT TRY CATCH BLOCK ALTERNATIVE:
//////////////////////////////////////////
/* 
the catchAsync higher order function invokes and gives access to 
every async function the within its scope the req, res, next 
parameters.
*/
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
