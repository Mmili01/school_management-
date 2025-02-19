"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conflict = void 0;
const http_status_codes_1 = require("http-status-codes");
const custom_api_1 = require("./custom-api");
class Conflict extends custom_api_1.CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.StatusCodes.CONFLICT;
    }
}
exports.Conflict = Conflict;
