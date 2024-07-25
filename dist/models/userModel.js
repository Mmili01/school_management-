"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const mergerModel_1 = require("./mergerModel");
class User extends sequelize_1.Model {
    associate() {
        User.belongsTo(mergerModel_1.School, { targetKey: "schoolName" });
        User.hasMany(mergerModel_1.Student, { sourceKey: "userId" });
        User.hasMany(mergerModel_1.Lecturer, { sourceKey: "userId" });
    }
}
exports.User = User;
// user model
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    userType: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["student", "lecturer", "staff"],
        defaultValue: "student",
        allowNull: false,
    },
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "User",
});
