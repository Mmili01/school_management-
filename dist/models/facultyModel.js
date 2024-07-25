"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const departmentModel_1 = require("./departmentModel");
const schoolsModel_1 = require("./schoolsModel");
class Faculty extends sequelize_1.Model {
    associate() {
        Faculty.hasMany(departmentModel_1.Department, { sourceKey: "facultyCode" });
        Faculty.belongsTo(schoolsModel_1.School, { targetKey: "schoolName" });
    }
}
exports.Faculty = Faculty;
Faculty.init({
    facultyName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    facultyCode: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize: connectpg_1.sequelize, modelName: "Faculty" });
