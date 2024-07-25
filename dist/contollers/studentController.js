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
exports.deleteStudent = exports.updateStudent = exports.getSingleStudent = exports.getAllstudents = exports.createStudent = void 0;
const mergerModel_1 = require("../models/mergerModel");
const studentemail_1 = require("../utils/studentemail");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
const sequelize_1 = require("sequelize");
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, surname, password, email, schoolName, departmentId, schoolEmailExtension, } = req.body;
    try {
        const school = yield mergerModel_1.School.findOne({
            where: { emailExtension: schoolEmailExtension },
        });
        if (!school) {
            throw new errors_1.BadRequestError("school email extension doesn't exist");
        }
        const schoolName = school.schoolName;
        // Generate temporary password and hash
        const email = (0, studentemail_1.generateStudentGmail)(firstName, lastName, surname, schoolName);
        const temporaryPassword = (0, uuid_1.v4)();
        const passwordHash = yield bcrypt.hash(temporaryPassword, 10);
        // Create User
        const user = yield mergerModel_1.User.create({
            firstName,
            lastName,
            surname,
            email,
            password: passwordHash, // Hashed password
            userType: "student",
            schoolName: schoolName, // Assuming school name is retrieved elsewhere
        });
        // Create Student (associated with User)
        const student = yield mergerModel_1.Student.create({
            userId: user.id,
            departmentId,
            studentemail: email,
        });
        // Generate Admission Link
        const admissionLink = `https://schooldomainname/admission/${student.userId}`;
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ msg: "Student created successfully", student, admissionLink });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error creating student" });
    }
});
exports.createStudent = createStudent;
const getAllstudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.body;
    const serachCriteria = {
        [sequelize_1.Op.or]: [
            { facultyName: identifier },
            { schoolName: identifier },
            { departmentName: identifier },
        ],
    };
    try {
        const students = yield mergerModel_1.Student.findAll({ where: serachCriteria });
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: students });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was a problem fetching students " });
    }
});
exports.getAllstudents = getAllstudents;
const getSingleStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.body;
    const searchCriteria = {
        [sequelize_1.Op.or]: [
            { firstName: identifier },
            { lastName: identifier },
            { regNumber: identifier },
        ],
    };
    try {
        const student = yield mergerModel_1.Student.findOne({ where: searchCriteria });
        if (!student) {
            res.status(http_status_codes_1.StatusCodes.OK).send({ msg: "No Student found" });
        }
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: student });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error fetching student " });
    }
});
exports.getSingleStudent = getSingleStudent;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.body;
    const serachCriteria = {
        [sequelize_1.Op.or]: [
            { firstName: identifier },
            { lastName: identifier },
            { surname: identifier },
            { Assignments: identifier },
        ],
    };
    const studentDetails = yield mergerModel_1.Student.findOne({ where: serachCriteria });
    try {
        if (!studentDetails) {
            throw new errors_1.BadRequestError(`${serachCriteria} not found`);
        }
        studentDetails.update(Object.assign({}, req.body));
        const updatdedStudent = yield studentDetails.save();
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: updatdedStudent });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error updating student" });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.body;
    const searchCriteria = {
        [sequelize_1.Op.or]: [
            { regNumber: identifier },
            { firstName: identifier },
            { lastName: identifier },
        ],
    };
    const student = yield mergerModel_1.Student.destroy({ where: searchCriteria });
    try {
        if (!student) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .send({ msg: "No student with such identifier" });
        }
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error deleting student" });
    }
});
exports.deleteStudent = deleteStudent;
