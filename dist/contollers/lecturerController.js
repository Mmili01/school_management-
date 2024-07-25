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
exports.deleteLecturer = exports.updateLecturer = exports.getSingleLecturer = exports.getAllLecturers = exports.createLecturer = void 0;
const mergerModel_1 = require("../models/mergerModel");
const lecturerEmail_1 = require("../utils/lecturerEmail");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
const sequelize_1 = require("sequelize");
const createLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, surname, departmentId, schoolEmailExtension, level, position, lecturerId, } = req.body;
    try {
        const school = yield mergerModel_1.School.findOne({
            where: { emailExtension: schoolEmailExtension },
        });
        if (!school) {
            throw new errors_1.BadRequestError("school email extension doesn't exist");
        }
        const schoolName = school.schoolName;
        // Generate temporary password and hash
        const email = (0, lecturerEmail_1.generateLecturerEmail)(firstName, lastName, surname, schoolName);
        const temporaryPassword = (0, uuid_1.v4)();
        const passwordHash = yield bcrypt.hash(temporaryPassword, 10);
        // Create User
        const user = yield mergerModel_1.User.create({
            firstName,
            lastName,
            surname,
            email,
            password: passwordHash, // Hashed password
            userType: "lecturer",
            schoolName: schoolName,
        });
        const lecturer = yield mergerModel_1.Lecturer.create({
            userId: user.id,
            departmentId,
            lecturerEmail: email,
            level,
            position,
            lecturerId,
        });
        // Generate Admission Link
        const admissionLink = `https://schooldomainname/admission/${lecturer.userId}`;
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ msg: "Student created successfully", lecturer, admissionLink });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error creating student" });
    }
});
exports.createLecturer = createLecturer;
const getAllLecturers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.body;
    const serachCriteria = {
        [sequelize_1.Op.or]: [
            { facultyName: identifier },
            { schoolName: identifier },
            { departmentName: identifier },
        ],
    };
    try {
        const lecturers = yield mergerModel_1.Lecturer.findAll({ where: serachCriteria });
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: lecturers });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was a problem fetching Lecturers " });
    }
});
exports.getAllLecturers = getAllLecturers;
const getSingleLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.body;
    const searchCriteria = {
        [sequelize_1.Op.or]: [
            { firstName: identifier },
            { lastName: identifier },
            { regNumber: identifier },
        ],
    };
    try {
        const lecturer = yield mergerModel_1.Lecturer.findOne({ where: searchCriteria });
        if (!lecturer) {
            res.status(http_status_codes_1.StatusCodes.OK).send({ msg: "No Student found" });
        }
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: lecturer });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error fetching student " });
    }
});
exports.getSingleLecturer = getSingleLecturer;
const updateLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.body;
    const serachCriteria = {
        [sequelize_1.Op.or]: [
            { facultyName: identifier },
            { facultyCode: identifier },
            { location: identifier },
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
exports.updateLecturer = updateLecturer;
const deleteLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteLecturer = deleteLecturer;
