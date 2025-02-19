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
exports.deleteAssignment = exports.updateAssignment = exports.getSingleAssignment = exports.getAllAssignments = exports.createAssignment = void 0;
const assignmentModel_1 = require("../models/assignmentModel");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const departmentModel_1 = require("../models/departmentModel");
const facultyModel_1 = require("../models/facultyModel");
const createAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, dueDate, departmentId, facultyCode } = req.body;
    if (!title || !description || !dueDate || !departmentId || !facultyCode) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ msg: "Fill up the neccessary parameters" });
    }
    const department = yield departmentModel_1.Department.findOne({ where: { departmentId } });
    if (!department) {
        throw new errors_1.BadRequestError("Department doesn't exist");
    }
    const faculty = yield facultyModel_1.Faculty.findOne({ where: { facultyCode } });
    if (!faculty) {
        throw new errors_1.BadRequestError("Faculty doesn't exist");
    }
    const alreadyExist = yield assignmentModel_1.Assignment.findOne({ where: { title } });
    if (alreadyExist) {
        throw new errors_1.Conflict("Assignment already exists");
    }
    try {
        const assignment = yield assignmentModel_1.Assignment.create({
            title,
            description,
            dueDate,
            departmentId,
            facultyCode,
        });
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ assignment, msg: "Assignment created successfully!!!" });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "There was an error creating assignment", error });
    }
});
exports.createAssignment = createAssignment;
const getAllAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { facultyCode, departmentId, dueDate } = req.query;
    try {
        const serachCriteria = {};
        if (facultyCode) {
            serachCriteria.facultyCode = facultyCode;
        }
        if (departmentId) {
            serachCriteria.departmentId = departmentId;
        }
        if (dueDate) {
            serachCriteria.dueDate = dueDate;
        }
        const assignment = yield assignmentModel_1.Assignment.findAll({ where: serachCriteria });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ assignment, msg: "Here are the assignmets" });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ Msg: "There was an error fethching assignments ", error });
    }
});
exports.getAllAssignments = getAllAssignments;
const getSingleAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    try {
        const assignment = yield assignmentModel_1.Assignment.findOne({ where: { id: identifier } });
        if (!assignment) {
            throw new errors_1.BadRequestError("Assignment does not exist ");
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ assignment });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "There was an error fetching assignment", error });
    }
});
exports.getSingleAssignment = getSingleAssignment;
const updateAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    const { title, description, dueDate } = req.body;
    try {
        const assignment = yield assignmentModel_1.Assignment.findOne({ where: { id: identifier } });
        if (!assignment) {
            throw new errors_1.BadRequestError("Assignment does not exist ");
        }
        const updatedAssignment = yield assignment.update(Object.assign({}, req.body));
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ updatedAssignment, msg: "Assignment updated successfully" });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "There was an error updating assignment ", error });
    }
});
exports.updateAssignment = updateAssignment;
const deleteAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.id;
    try {
        const assignment = yield assignmentModel_1.Assignment.findOne({ where: { id: identifier } });
        if (!assignment) {
            throw new errors_1.BadRequestError("Assignment not found");
        }
        yield assignment.destroy();
        yield assignment.reload();
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Assignment deletes successfully" });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "There was an error deleting assignment", error });
    }
});
exports.deleteAssignment = deleteAssignment;
