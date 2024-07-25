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
exports.login = exports.register = void 0;
const mergerModel_1 = require("../models/mergerModel");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const schoolgmail_1 = require("../utils/schoolgmail");
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { schoolName, password, location, schoolID, schoolType } = req.body;
    const alreadyExist = yield mergerModel_1.School.findOne({ where: { schoolName } });
    if (alreadyExist) {
        res
            .status(http_status_codes_1.StatusCodes.CONFLICT)
            .send({ msg: "This user already exists!!!!" });
    }
    if (!alreadyExist) {
        try {
            const emailExtension = (0, schoolgmail_1.generateGmailExtension)(schoolName);
            const school = yield mergerModel_1.School.create({
                schoolName,
                password,
                location,
                schoolID,
                schoolType,
                emailExtension,
            });
            const payload = { schoolName }; // Use correct type
            const token = jwt.sign(payload, process.env.SECRETKEY, {
                expiresIn: "30d",
            });
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: "School created successfully", token, school });
        }
        catch (error) {
            console.error(error);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ msg: "There was an error creating user" });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { schoolName, password } = req.body;
    if (!schoolName || !password) {
        throw new errors_1.BadRequestError("parameters cannot be empty ");
    }
    const school = yield mergerModel_1.School.findOne({ where: { schoolName } });
    if (!school) {
        throw new errors_1.UnauthorisedError("Username or password incorrect");
    }
    const isPasswordValid = school.validPassword(password);
    if (!isPasswordValid) {
        throw new errors_1.UnauthorisedError("Username or password incorrect");
    }
    const payload = { schoolName }; // Use correct type
    const token = jwt.sign(payload, process.env.SECRETKEY, {
        expiresIn: "30d",
    });
    res.status(http_status_codes_1.StatusCodes.OK).send({ msg: "Login successful", token });
});
exports.login = login;
