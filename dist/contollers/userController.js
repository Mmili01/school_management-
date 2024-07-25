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
exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.createUser = void 0;
const userModel_1 = require("../models/userModel");
const http_status_codes_1 = require("http-status-codes");
const sequelize_1 = require("sequelize");
const bad_request_1 = require("../errors/bad-request");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, surname, password, userType, schoolName, email, } = req.body;
    try {
        const user = yield userModel_1.User.create({
            firstName,
            lastName,
            surname,
            password,
            userType,
            schoolName,
            email,
        });
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: user });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error creating user" });
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schoolName = req.body;
    try {
        const users = yield userModel_1.User.findAll({ where: { schoolName } });
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: users });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error fetching user" });
    }
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, surname } = req.body;
    try {
        const user = yield userModel_1.User.findOne({ where: { firstName, surname } });
        if (!user) {
            res.send({ msg: `${user} not found` });
        }
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: user });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "Error fetching user" });
    }
});
exports.getSingleUser = getSingleUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.body;
    const searchCriteria = {
        [sequelize_1.Op.or]: [
            { firstName: identifier },
            { lastName: identifier },
            { surname: identifier },
        ],
    };
    const userDetails = yield userModel_1.User.findOne({ where: searchCriteria });
    try {
        if (!userDetails) {
            throw new bad_request_1.BadRequestError(`${searchCriteria} not found`);
        }
        userDetails.update(Object.assign({}, req.body));
        const updatdedUser = yield userDetails.save();
        res.status(http_status_codes_1.StatusCodes.OK).send({ msg: updatdedUser });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "There was an error updating user" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, surname } = req.body;
    const user = yield userModel_1.User.findOne({ where: { firstName, surname } });
    try {
        if (!user) {
            throw new bad_request_1.BadRequestError("User not found");
        }
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ msg: "Error deleting user" });
    }
});
exports.deleteUser = deleteUser;
