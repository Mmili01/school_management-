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
exports.register = void 0;
const schools_1 = require("../models/schools");
const http_status_codes_1 = require("http-status-codes");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { schoolName } = req.body;
    const alreadyExist = yield schools_1.School.findOne({ where: { schoolName } });
    if (alreadyExist) {
        res
            .status(http_status_codes_1.StatusCodes.CONFLICT)
            .send({ msg: "This user already exists!!!!" });
    }
    if (!alreadyExist) {
        try {
            const user = yield schools_1.School.create({
                schoolName,
            });
            res.status(http_status_codes_1.StatusCodes.OK).send({ msg: user });
        }
        catch (error) {
            console.error(error);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ msg: "There was an error creating user" });
        }
        console.log(schoolName);
        console.log(req.body);
    }
});
exports.register = register;
