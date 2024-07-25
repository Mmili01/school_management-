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
exports.offerAdmission = void 0;
const userModel_1 = require("../models/userModel");
const studentsModel_1 = require("../models/studentsModel");
const mergerModel_1 = require("../models/mergerModel");
const studentemail_1 = require("../utils/studentemail");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
const offerAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailExtension, firstName, lastName, surname, departmentId, schoolName } = req.body;
    try {
        const school = mergerModel_1.School.findOne({ where: { emailExtension } });
        if (!school) {
            throw new errors_1.BadRequestError("school email extension doesn't exist");
        }
        const email = (0, studentemail_1.generateStudentGmail)(firstName, lastName, surname, emailExtension);
        const temporaryPassword = (0, uuid_1.v4)();
        const password = yield bcrypt.hash(temporaryPassword, 10);
        const newUser = yield userModel_1.User.create({
            firstName,
            lastName,
            surname,
            password,
            userType: "student",
            schoolName,
            email
        });
        const newStudent = yield studentsModel_1.Student.create({
            userId: newUser.id,
            departmentId: departmentId,
            studentemail: email,
        });
        const admissionLink = `https://schooldomainname/admission/${newStudent.userId}`;
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({
            msg: "Admission offered sucessfully ",
            newStudent,
            admissionLink,
        });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send("there was an error offering admission ");
    }
});
exports.offerAdmission = offerAdmission;
