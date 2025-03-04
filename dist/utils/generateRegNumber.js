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
exports.generateRegNumber = void 0;
const errors_1 = require("../errors");
const departmentModel_1 = require("../models/departmentModel");
const studentsModel_1 = require("../models/studentsModel");
function generateRegNumber(departmentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentYear = new Date().getFullYear();
        const department = yield departmentModel_1.Department.findOne({ where: { id: departmentId } });
        if (!department) {
            throw new errors_1.BadRequestError("Department not found");
        }
        const departmentCode = department.departmentId.toString().padStart(3, "0");
        const studentCount = yield studentsModel_1.Student.count({ where: { departmentId } });
        return `${currentYear}${departmentCode}${studentCount + 1}`;
    });
}
exports.generateRegNumber = generateRegNumber;
