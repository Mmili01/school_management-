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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
const sequelize_1 = require("sequelize");
const connectpg_1 = require("../db/connectpg");
const schoolgmail_1 = require("../utils/schoolgmail");
const bcrypt = __importStar(require("bcryptjs"));
const userModel_1 = require("./userModel");
const facultyModel_1 = require("./facultyModel");
class School extends sequelize_1.Model {
    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
    associate() {
        School.hasMany(facultyModel_1.Faculty, { sourceKey: "schoolId" });
        School.hasMany(userModel_1.User, { sourceKey: "schoolName" });
    }
}
exports.School = School;
School.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    schoolName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    schoolType: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["Federal", "State", "Private"],
        allowNull: true,
    },
    schoolImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    schoolID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    emailExtension: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: connectpg_1.sequelize,
    modelName: "School",
    hooks: {
        beforeCreate: (school) => __awaiter(void 0, void 0, void 0, function* () {
            school.emailExtension = (0, schoolgmail_1.generateGmailExtension)(school.schoolName);
            const salt = yield bcrypt.genSalt(10);
            school.password = yield bcrypt.hash(school.password, salt);
        }),
    },
});
