"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.logout = exports.studentsLogin = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const userModel_1 = require("../models/userModel");
const studentsLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ msg: "Please input email and password" });
    }
    try {
        const username = yield userModel_1.User.findOne({ where: { email: email } });
        if (!username) {
            throw new errors_1.UnauthorisedError("Username or Password incorrect");
        }
        const isPasswordValid = username.validPassword(password);
        if (!isPasswordValid) {
            throw new errors_1.UnauthorisedError("Username or passowrd invalid");
        }
        console.log(typeof username);
        const identity = username.id;
        const payload = { id: identity };
        const token = jwt.sign(payload, process.env.SECRETEKEY, {
            expiresIn: "30d",
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "login successful", token });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "There was an error logging in " });
    }
});
exports.studentsLogin = studentsLogin;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", "logout"), {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000)
    };
    res.status(http_status_codes_1.StatusCodes.OK).json("logged out");
});
exports.logout = logout;
