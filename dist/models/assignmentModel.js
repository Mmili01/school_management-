"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const departmentModel_1 = require("./departmentModel");
const facultyModel_1 = require("./facultyModel");
const lecturerModel_1 = require("./lecturerModel");
const studentsModel_1 = require("./studentsModel");
class Assignment extends sequelize_1.Model {
    associate() {
        Assignment.belongsTo(studentsModel_1.Student, { targetKey: "StudentId" });
        Assignment.belongsTo(lecturerModel_1.Lecturer, { targetKey: "LecturerId" });
        Assignment.belongsTo(departmentModel_1.Department, { targetKey: "DepartmentId" });
        Assignment.belongsTo(facultyModel_1.Faculty, { targetKey: "FacultyId" });
    }
}
exports.Assignment = Assignment;
Assignment.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    dueDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    facultyCode: {
        type: sequelize_1.DataTypes.STRING,
    },
    departmentId: {
        type: sequelize_1.DataTypes.STRING,
    },
}, { sequelize: connectpg_1.sequelize, tableName: "Assignment" });
