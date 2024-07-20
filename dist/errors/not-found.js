"use strict";
// // const { StatusCodes } = require('http-status-codes');
// // const CustomAPIError = require('./custom-api');
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
// class NotFoundError extends CustomAPIError {
//   constructor(message) {
//     super(message);
//     this.statusCode = StatusCodes.NOT_FOUND;
//   }
// }
// module.exports = NotFoundError;
const http_status_codes_1 = require("http-status-codes");
const custom_api_1 = require("./custom-api");
class NotFoundError extends custom_api_1.CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCodes = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
