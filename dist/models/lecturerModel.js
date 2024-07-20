"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecturer = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const departmentModel_1 = require("./departmentModel");
const userModel_1 = require("./userModel");
class Lecturer extends sequelize_1.Model {
}
exports.Lecturer = Lecturer;
Lecturer.init({
    level: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "Lecturer II"
    },
    position: {
        type: sequelize_1.DataTypes.STRING,
    },
    lecturerId: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.User,
            key: "id",
        },
    },
    departmentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: departmentModel_1.Department,
            key: "departmentId",
        },
    },
    lecturerEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "Lecturer",
});
