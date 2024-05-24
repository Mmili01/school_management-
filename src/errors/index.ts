// const CustomAPIError = require('./custom-api');
// const UnauthenticatedError = require('./unauthenticated');
// const NotFoundError = require('./not-found');
// const BadRequestError = require('./bad-request');
// const UnauthorizedError = require('./unauthorized');
// module.exports = {
//   CustomAPIError,
//   UnauthenticatedError,
//   NotFoundError,
//   BadRequestError,
//   UnauthorizedError,
// };

import  {CustomAPIError }from "./custom-api";
import  {UnauthenticatedError}  from "./unauthenticated";
import { NotFoundError } from "./not-found";
import {BadRequestError} from "./bad-request";
import  {UnauthorisedError }from "./unauthorised";

export  {CustomAPIError,UnauthenticatedError, NotFoundError,BadRequestError, UnauthorisedError}