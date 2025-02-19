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
exports.deleteDepartment = exports.updateDepartment = exports.getSingleDepartment = exports.getAllDepartments = exports.createDepartment = void 0;
const departmentModel_1 = require("../models/departmentModel");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const facultyModel_1 = require("../models/facultyModel");
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentName, departmentId, initials, yearsOfStudy, facultyCode } = req.body;
    console.log(departmentName);
    // Check if all required fields are present
    if (!departmentName ||
        !departmentId ||
        !initials ||
        !yearsOfStudy ||
        !facultyCode) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ msg: "All fields are required" });
    }
    const alreadyExist = yield departmentModel_1.Department.findOne({ where: { departmentName } });
    if (alreadyExist) {
        throw new errors_1.Conflict("Department already exists");
    }
    if (!alreadyExist) {
        try {
            const faculty = yield facultyModel_1.Faculty.findOne({ where: { facultyCode } });
            if (!faculty) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: "Faculty does not exist" });
            }
            else {
                const department = yield departmentModel_1.Department.create(Object.assign({}, req.body));
                res.status(http_status_codes_1.StatusCodes.OK).json({ msg: department });
                console.log(department);
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ msg: "Error creating department" });
        }
    }
});
exports.createDepartment = createDepartment;
const getAllDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { facultyCode } = req.body;
        const departments = yield departmentModel_1.Department.findAll({ where: { facultyCode } });
        if (departments.length === 0) {
            return res
                .status(http_status_codes_1.StatusCodes.NO_CONTENT)
                .json({ message: "No departments found under this faculty" });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json({ departments });
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "An error occurred while fetching departments" });
    }
});
exports.getAllDepartments = getAllDepartments;
const getSingleDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const departmentId = req.params.id;
    try {
        const department = yield departmentModel_1.Department.findOne({
            where: { id: departmentId },
        });
        if (!department) {
            throw new errors_1.BadRequestError(`${department} not found`);
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, msg: department });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            msg: "There was an error fetching department",
            error,
        });
    }
});
exports.getSingleDepartment = getSingleDepartment;
const updateDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    const allowedFields = [
        "departmentName",
        "departmentId",
        "initials",
        "yearsOfStudy",
        "facultyCode",
    ];
    const departmentDetails = yield departmentModel_1.Department.findOne({
        where: { id: identifier },
    });
    try {
        if (!departmentDetails) {
            throw new errors_1.BadRequestError(`${identifier} not found`);
        }
        // filter allowed fields
        const updateData = Object.keys(req.body)
            .filter((key) => allowedFields.includes(key))
            .reduce((obj, key) => {
            obj[key] = req.body[key];
            return obj;
        }, {});
        // check if there are any valid fields to update
        if (Object.keys(updateData).length === 0) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ msg: "There are no fields to update" });
        }
        yield departmentDetails.update(Object.assign({}, req.body));
        yield departmentDetails.reload();
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: departmentDetails });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "there was an error updating department" });
    }
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    try {
        const department = yield departmentModel_1.Department.destroy({ where: { id: identifier } });
        if (!department) {
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: `no department with name ${identifier}` });
        }
        else {
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: `Department deleted successfully ` });
        }
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "error deleting department" });
    }
});
exports.deleteDepartment = deleteDepartment;
