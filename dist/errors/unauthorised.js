"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorisedError = void 0;
const http_status_codes_1 = require("http-status-codes");
const custom_api_1 = require("./custom-api");
class UnauthorisedError extends custom_api_1.CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCodes = http_status_codes_1.StatusCodes.FORBIDDEN;
    }
}
exports.UnauthorisedError = UnauthorisedError;
