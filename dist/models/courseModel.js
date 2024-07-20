"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
class Course extends sequelize_1.Model {
}
exports.Course = Course;
Course.init({
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
        allowNull: false,
    },
    semester: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["first", "second"],
    },
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "Course"
});
