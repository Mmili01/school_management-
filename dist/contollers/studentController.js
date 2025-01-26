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
const generateRegNumber_1 = require("../utils/generateRegNumber");
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("in here");
    const { firstName, lastName, surname, userType, schoolEmailExtension, email, 
    // student specific details
    departmentName, level, departmentId, } = req.body;
    try {
        if (userType !== "student") {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ msg: "User is not a student" });
        }
        //create an email using school email extension
        const school = yield mergerModel_1.School.findOne({
            where: { emailExtension: schoolEmailExtension },
        });
        // check if school exists
        if (!school) {
            throw new errors_1.BadRequestError("school email extension doesn't exist");
        }
        // assign school name from school
        const schoolName = school.schoolName;
        console.log(schoolName);
        // Generate student email
        const semail = (0, studentemail_1.generateStudentGmail)(firstName, lastName, surname, schoolEmailExtension);
        // Checking if required student-specific fields are present
        if (!departmentId) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                msg: "Department is required for creating a lecturer",
            });
        }
        // Generate reg number
        const studentRegNumber = yield (0, generateRegNumber_1.generateRegNumber)(departmentId);
        // Generate temporary password
        const temporaryPassword = (0, uuid_1.v4)();
        const passwordHash = yield bcrypt.hash(temporaryPassword, 10);
        // Create user first
        const user = yield mergerModel_1.User.create({
            firstName,
            lastName,
            surname,
            password: passwordHash,
            userType,
            schoolName: schoolName,
            email,
        });
        console.log(user);
        const student = yield mergerModel_1.Student.create({
            userId: user.id,
            studentemail: semail,
            departmentId,
            departmentName,
            level,
            regNumber: studentRegNumber,
        });
        console.log(student);
        // Generate Admission Link
        const admissionLink = `https://schooldomainname/admission/${student.userId}`;
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            msg: "Student created successfully",
            user,
            student,
            admissionLink,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            msg: "There was an error creating student",
            error,
        });
        console.log(error);
    }
});
exports.createStudent = createStudent;
const getAllstudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier, page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;
    const searchCriteria = {
        [sequelize_1.Op.or]: [identifier ? { departmentId: identifier } : null].filter(Boolean),
    };
    try {
        const students = yield mergerModel_1.Student.findAndCountAll({
            where: searchCriteria,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            msg: "students created successfully  ",
            data: {
                total: students.count,
                currentPage: page,
                totalPages: Math.ceil(students.count / limit),
                students: students.rows,
            },
        });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "There was a problem fetching students ", error });
    }
});
exports.getAllstudents = getAllstudents;
const getSingleStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    try {
        const student = yield mergerModel_1.Student.findOne({ where: { id: identifier } });
        if (!student) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ msg: "No Student found" });
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
    const identifier = req.params.id;
    const allowedFields = [
        "firstName",
        "lastName",
        "surname",
        "userType",
        "email",
        "departmentId",
        "level",
        "position",
        "lecturerId",
        "facultyName",
        "facultyId",
        "departmentName",
    ];
    const studentDetails = yield mergerModel_1.Student.findOne({ where: { id: identifier } });
    try {
        if (!studentDetails) {
            throw new errors_1.BadRequestError(`student with ID ${identifier} not found`);
        }
        // filter out only allowed feilds
        const updateData = Object.keys(req.body)
            .filter((key) => allowedFields.includes(key))
            .reduce((obj, key) => {
            obj[key] = req.body[key];
            return obj;
        }, {});
        // Check if there are any valid fields to update
        if (Object.keys(updateData).length === 0) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                msg: "No valid fields to update",
            });
        }
        yield studentDetails.update(updateData);
        yield studentDetails.reload();
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ msg: "Student data updated successfull", studentDetails });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error updating student" });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    const student = yield mergerModel_1.Student.destroy({ where: { id: identifier } });
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
