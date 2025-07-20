const BadRequestError = require('./badRequest');
const NotFoundError = require('./notFound');
const UnauthenticatedError=require('./unauthenticatedError')
// const CustomAPIError=require('./customError')
module.exports = {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError
};
