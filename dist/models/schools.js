"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
exports.School = connectpg_1.sequelize.define("School", {
    schoolName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    schoolType: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["Fedral", "State", "Private"],
        allowNull: true,
    },
    schoolImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
});
const Faculty = connectpg_1.sequelize.define("Faculty", {
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
        allowNull: false
    },
});
const Course = connectpg_1.sequelize.define("Course", {
    courseName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    courseCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    creditLoad: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    semester: {
        type: sequelize_1.DataTypes.ENUM,
        values: ['first', "second"]
    },
});
exports.School.hasMany(Faculty, { foreignKey: "facultyCode" });
exports.School.hasMany(Course, { foreignKey: "courseCode" });
exports.School.sync().then(() => {
    console.log("School Model Synced");
});
