// // const { StatusCodes } = require('http-status-codes');
// // const CustomAPIError = require('./custom-api');

// class NotFoundError extends CustomAPIError {
//   constructor(message) {
//     super(message);
//     this.statusCode = StatusCodes.NOT_FOUND;
//   }
// }

// module.exports = NotFoundError;

import { StatusCodes } from "http-status-codes";
import  {CustomAPIError}  from "./custom-api";

export class NotFoundError extends CustomAPIError{
    public statusCodes : StatusCodes
    constructor (message:string){
        super(message)
        this.statusCodes = StatusCodes.NOT_FOUND
    }

}