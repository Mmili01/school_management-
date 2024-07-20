"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const facultyModel_1 = require("./facultyModel");
class Department extends sequelize_1.Model {
}
exports.Department = Department;
Department.init({
    departmentName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    departmentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    yearsOfStudy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    initials: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    facultyCode: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: facultyModel_1.Faculty,
            key: "facultyCode",
        },
    },
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "Department",
});
