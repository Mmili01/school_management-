"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../contollers/authController");
exports.router = express_1.default.Router();
exports.router.post("/register", authController_1.register);
exports.router.post("/login", authController_1.login);
