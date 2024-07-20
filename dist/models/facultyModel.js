"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const schoolsModel_1 = require("./schoolsModel");
class Faculty extends sequelize_1.Model {
    static associate(model) {
        Faculty.hasMany(model.Department, { foreignKey: 'facultyCode' });
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
    schoolName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: schoolsModel_1.School,
            key: "schoolName"
        }
    }
}, { sequelize: connectpg_1.sequelize, modelName: "Faculty" });
