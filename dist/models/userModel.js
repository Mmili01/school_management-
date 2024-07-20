"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const mergerModel_1 = require("./mergerModel");
class User extends sequelize_1.Model {
    static associate(models) {
        User.hasMany(models.Student, { foreignKey: "userId" });
    }
}
exports.User = User;
// user model 
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    schoolName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: mergerModel_1.School,
            key: "schoolName"
        }
    }
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "User",
});
