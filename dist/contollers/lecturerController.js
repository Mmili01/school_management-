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
    const { firstName, lastName, surname, userType, schoolEmailExtension, email, 
    // Lecturer-specific fields
    departmentId, level, position, lecturerId, facultyName, facultyId, departmentName, } = req.body;
    try {
        // First, verify that the user type is actually 'lecturer'
        if (userType !== "lecturer") {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                msg: "Cannot create lecturer. User type is not 'lecturer'.",
            });
        }
        // create an email using school email extension
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
        console.log("Reached here");
        // Generate temporary password and hash
        const lemail = (0, lecturerEmail_1.generateLecturerEmail)(firstName, lastName, surname, schoolName);
        const temporaryPassword = (0, uuid_1.v4)();
        const passwordHash = yield bcrypt.hash(temporaryPassword, 10);
        // Checking if required lecturer-specific fields are present
        if (!departmentId) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                msg: "Department is required for creating a lecturer",
            });
        }
        // Create user first
        const user = yield mergerModel_1.User.create({
            firstName,
            lastName,
            surname,
            password: passwordHash,
            userType,
            schoolName,
            email,
        });
        console.log(user);
        // Create lecturer, referencing the user
        const lecturer = yield mergerModel_1.Lecturer.create({
            userId: user.id,
            departmentId,
            level,
            position,
            lecturerId,
            lecturerEmail: lemail,
            facultyId,
            facultyName,
            departmentName,
        });
        // Generate Admission Link
        const admissionLink = `https://schooldomainname/admission/${lecturer.userId}`;
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            msg: "Lecturer created successfully",
            user,
            lecturer,
            admissionLink,
        });
        console.log(lecturer);
    }
    catch (error) {
        console.error("Error creating lecturer:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "There was an error creating lecturer",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createLecturer = createLecturer;
const getAllLecturers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, page = 1, limit = 10, } = req.body;
        const offset = (page - 1) * limit;
        const searchCriteria = {
            [sequelize_1.Op.or]: [identifier ? { departmentId: identifier } : null].filter(Boolean),
        };
        const lecturers = yield mergerModel_1.Lecturer.findAndCountAll({
            where: searchCriteria,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            attributes: [
                "id",
                "level",
                "position",
                "lecturerId",
                "lecturerEmail",
                "facultyName",
                "departmentName",
                "createdAt",
            ],
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            msg: "Lecturers retrieved successfully",
            data: {
                total: lecturers.count,
                currentPage: page,
                totalPages: Math.ceil(lecturers.count / limit),
                lecturers: lecturers.rows,
            },
        });
    }
    catch (error) {
        console.error("Error in getAllLecturers", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            msg: "Failed to retrieve lecturers",
            error: error || "An unexpected error occurred",
        });
    }
});
exports.getAllLecturers = getAllLecturers;
const getSingleLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    console.log(identifier);
    console.log(typeof identifier);
    const lecturer = yield mergerModel_1.Lecturer.findOne({ where: { id: identifier } });
    try {
        if (!lecturer) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ msg: "Lecturer not found" });
            console.log(lecturer);
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json({ msg: lecturer });
            console.log(lecturer);
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
        console.log(lecturer);
    }
});
exports.getSingleLecturer = getSingleLecturer;
const updateLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    // Define allowed fields to update
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
    try {
        const lecturer = yield mergerModel_1.Lecturer.findOne({ where: { id: identifier } });
        if (!lecturer) {
            return res.status(404).json({
                msg: `Lecturer with id ${identifier} not found`,
            });
        }
        // Filter out only allowed fields
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
        // Update with only the allowed fields
        yield lecturer.update(updateData);
        // Reload to get the most recent data
        yield lecturer.reload();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            msg: "Lecturer updated successfully",
            lecturer,
        });
    }
    catch (error) {
        console.error("Update Lecturer Error:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "There was an error updating lecturer",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.updateLecturer = updateLecturer;
const deleteLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    console.log(identifier);
    const searchCriteria = {
        [sequelize_1.Op.or]: [{ firstName: identifier }, { lastName: identifier }],
    };
    const lecturer = yield mergerModel_1.Lecturer.destroy({ where: searchCriteria });
    try {
        if (!lecturer) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ msg: "No lecturer with such identifier" });
        }
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "There was an error deleting lecturer" });
    }
});
exports.deleteLecturer = deleteLecturer;
