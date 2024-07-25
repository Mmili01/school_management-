"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const facultyModel_1 = require("./facultyModel");
const lecturerModel_1 = require("./lecturerModel");
const studentsModel_1 = require("./studentsModel");
class Department extends sequelize_1.Model {
    associate() {
        Department.hasMany(studentsModel_1.Student, {
            sourceKey: "userId",
            foreignKey: "departmentId",
        });
        Department.hasMany(lecturerModel_1.Lecturer, { sourceKey: "userId" });
        Department.belongsTo(facultyModel_1.Faculty, { targetKey: "facultyCode" });
    }
}
exports.Department = Department;
Department.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
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
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "Department",
});
