"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecturer = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const departmentModel_1 = require("./departmentModel");
const userModel_1 = require("./userModel");
class Lecturer extends sequelize_1.Model {
    associate() {
        Lecturer.belongsTo(userModel_1.User, { targetKey: "userId" });
        Lecturer.belongsTo(departmentModel_1.Department, { targetKey: "departmentId" });
    }
}
exports.Lecturer = Lecturer;
Lecturer.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    level: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "Lecturer II",
    },
    position: {
        type: sequelize_1.DataTypes.STRING,
    },
    lecturerId: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
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
