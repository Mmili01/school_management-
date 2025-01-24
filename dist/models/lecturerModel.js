"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecturer = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const departmentModel_1 = require("./departmentModel");
const facultyModel_1 = require("./facultyModel");
const userModel_1 = require("./userModel");
class Lecturer extends sequelize_2.Model {
    associate() {
        Lecturer.belongsTo(userModel_1.User, { targetKey: "userId" });
        Lecturer.belongsTo(departmentModel_1.Department, { targetKey: "departmentId" });
        Lecturer.belongsTo(departmentModel_1.Department, { targetKey: "departmentName" });
        Lecturer.belongsTo(facultyModel_1.Faculty, { targetKey: "facultyName" });
        Lecturer.belongsTo(facultyModel_1.Faculty, { foreignKey: 'facultyId' });
    }
}
exports.Lecturer = Lecturer;
Lecturer.init({
    id: {
        type: sequelize_2.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
    },
    level: {
        type: sequelize_2.DataTypes.STRING,
        defaultValue: "Lecturer II",
    },
    position: {
        type: sequelize_2.DataTypes.STRING,
    },
    lecturerId: {
        type: sequelize_2.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    lecturerEmail: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    facultyName: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: true,
    },
    facultyId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: true
    },
    departmentId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: true
    },
    departmentName: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "Lecturer",
});
