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
const sequelize_1 = require("sequelize");
const departmentModel_1 = require("../models/departmentModel");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentName, departmentId, initials, yearsOfStudy, facultyCode } = req.body;
    const alreadyExist = yield departmentModel_1.Department.findOne({ where: { departmentName } });
    if (alreadyExist) {
        res.status(http_status_codes_1.StatusCodes.CONFLICT).send({ msg: "Department already exists" });
    }
    if (!alreadyExist) {
        try {
            const department = yield departmentModel_1.Department.create({
                departmentName,
                departmentId,
                initials,
                yearsOfStudy,
                facultyCode,
            });
            res.status(http_status_codes_1.StatusCodes.OK).send({ msg: department });
        }
        catch (error) {
            console.error(error);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ msg: "Error creating department" });
        }
    }
});
exports.createDepartment = createDepartment;
const getAllDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { facultyCode } = req.body;
    const departments = yield departmentModel_1.Department.findByPk(facultyCode);
    if (!departments) {
        res.send({ msg: "no departments under this faculty" });
    }
    res.status(http_status_codes_1.StatusCodes.OK).send({ msg: departments });
});
exports.getAllDepartments = getAllDepartments;
const getSingleDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const departmentId = req.body;
    const department = yield departmentModel_1.Department.findOne({ where: departmentId });
    if (!department) {
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ msg: `no department with id ${departmentId}` });
    }
    res.status(http_status_codes_1.StatusCodes.OK).send({ msg: department });
});
exports.getSingleDepartment = getSingleDepartment;
const updateDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.params;
    const serachCriteria = {
        [sequelize_1.Op.or]: [
            { departmentName: identifier },
            { departmentId: identifier },
            { initials: identifier },
            { yearsOfStudy: identifier },
            { facultyCode: identifier },
        ],
    };
    const departmentDetails = yield departmentModel_1.Department.findOne({
        where: serachCriteria,
    });
    try {
        if (!departmentDetails) {
            throw new errors_1.BadRequestError(`${identifier} not found`);
        }
        departmentDetails.update(Object.assign({}, req.body));
        const updatedDepartment = yield departmentDetails.save();
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: updatedDepartment });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ msg: 'there was an error updating department' });
    }
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const departmentName = req.body;
    try {
        const department = yield departmentModel_1.Department.destroy({ where: departmentName });
        if (!department) {
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .send({ msg: `no department with name ${departmentName}` });
        }
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: `Department deleted successfully ` });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ msg: 'error deleting department' });
    }
});
exports.deleteDepartment = deleteDepartment;
