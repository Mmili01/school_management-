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
exports.deleteFaculty = exports.updateFaculty = exports.getSingleFaculty = exports.getAllFaculties = exports.createFaculty = void 0;
const facultyModel_1 = require("../models/facultyModel");
const http_status_codes_1 = require("http-status-codes");
const sequelize_1 = require("sequelize");
const errors_1 = require("../errors");
const createFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { facultyName, facultyCode, location, schoolName } = req.body;
    const alreadyExist = yield facultyModel_1.Faculty.findOne({ where: { facultyName } });
    if (alreadyExist) {
        res.status(http_status_codes_1.StatusCodes.CONFLICT).send({ msg: "Faculty already exists" });
    }
    if (!alreadyExist) {
        try {
            const faculty = yield facultyModel_1.Faculty.create({
                facultyName,
                facultyCode,
                location,
                schoolName,
            });
            res.status(http_status_codes_1.StatusCodes.OK).send({ msg: faculty });
        }
        catch (error) {
            console.error(error);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ msg: "There was an issue creating the faculty " });
        }
    }
});
exports.createFaculty = createFaculty;
const getAllFaculties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schoolName } = req.body;
        const faculties = yield facultyModel_1.Faculty.findAll({ where: { schoolName } });
        if (faculties.length === 0) {
            res.status(http_status_codes_1.StatusCodes.OK).json("There are no faculties in this school");
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).send(faculties);
        }
        return;
    }
    catch (error) {
        console.error(error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "An error occurred while fetching faculties" });
    }
});
exports.getAllFaculties = getAllFaculties;
const getSingleFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { facultyName } = req.params;
    try {
        const faculty = yield facultyModel_1.Faculty.findOne({ where: { facultyName } });
        if (!faculty) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .send({ msg: `No faculty with name ${faculty}` });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).send({ msg: faculty });
        }
        return;
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "Error fetching faculty" });
    }
});
exports.getSingleFaculty = getSingleFaculty;
const updateFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.identifier) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send({ msg: "Missing 'identifier' property in request body" });
    }
    const { identifier } = req.body;
    const serachCriteria = {
        [sequelize_1.Op.or]: [
            { facultyName: { [sequelize_1.Op.like]: `%${identifier}%` } },
            { facultyCode: identifier },
            { location: identifier },
        ],
    };
    const facultyDetails = yield facultyModel_1.Faculty.findOne({ where: serachCriteria });
    try {
        if (!facultyDetails) {
            throw new errors_1.BadRequestError(`${serachCriteria} not found`);
        }
        facultyDetails.update(Object.assign({}, req.body));
        const updatdedFaculty = yield facultyDetails.save();
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: updatdedFaculty });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "Error updating faculty" });
    }
});
exports.updateFaculty = updateFaculty;
const deleteFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const facultyName = req.body;
    const faculty = yield facultyModel_1.Faculty.destroy({ where: { facultyName } });
    try {
        if (!faculty) {
            throw new errors_1.BadRequestError("Faculty not found");
        }
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: "Faculty deleted sucessfully" });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "Error deleting faculty" });
    }
});
exports.deleteFaculty = deleteFaculty;
