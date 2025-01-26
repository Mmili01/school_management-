"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const departmentModel_1 = require("./departmentModel");
const schoolsModel_1 = require("./schoolsModel");
class Faculty extends sequelize_2.Model {
    associate() {
        Faculty.hasMany(departmentModel_1.Department, { sourceKey: "facultyCode" });
        Faculty.belongsTo(schoolsModel_1.School, { targetKey: "schoolName" });
    }
}
exports.Faculty = Faculty;
Faculty.init({
    id: {
        type: sequelize_2.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
    },
    facultyName: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    facultyCode: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    location: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    schoolName: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false, // Adjust as needed
    },
}, { sequelize: connectpg_1.sequelize, modelName: "Faculty" });
