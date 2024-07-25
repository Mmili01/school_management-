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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const userModel_1 = require("./userModel");
const departmentModel_1 = require("./departmentModel");
const generateRegNumber_1 = require("../utils/generateRegNumber");
class Student extends sequelize_1.Model {
    static departmentId(departmentId) {
        throw new Error("Method not implemented.");
    }
}
exports.Student = Student;
_a = Student;
Student.hooks = {
    beforeCreate: (student) => __awaiter(void 0, void 0, void 0, function* () {
        student.regNumber = yield (0, generateRegNumber_1.generateRegNumber)(student.departmentId);
    }),
    associate() {
        _a.belongsTo(userModel_1.User, { targetKey: "userId" });
        _a.belongsTo(departmentModel_1.Department, { targetKey: "departmentId" });
    },
};
Student.init({
    regNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    CGPA: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 5.0,
    },
    Assignments: {
        type: sequelize_1.DataTypes.STRING,
    },
    level: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 100,
    },
    studentemail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "Student",
});
