"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const mergerModel_1 = require("./mergerModel");
const bcrypt = __importStar(require("bcryptjs"));
class User extends sequelize_1.Model {
    //static validPassword: any;
    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
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
    // hooks: {
    //   beforeCreate: async (user: User) => {
    //     const salt = await bcrypt.genSalt(10);
    //     user.password = await bcrypt.hash(user.password, salt);
    //   },
    // },
});
