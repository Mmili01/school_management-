"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const userModel_1 = require("../models/userModel");
const studentsLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: "Please input email and password" });
    }
    const username = yield userModel_1.User.findOne({ where: { email: email } });
    if (!username) {
        throw new errors_1.UnauthorisedError("Username or Password incorrect");
    }
    const isPasswordValid = userModel_1.User.validPassword(password);
});
