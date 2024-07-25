"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../contollers/studentController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const router = express_1.default.Router();
exports.router = router;
router
    .route("/")
    .get(authenticateUser_1.authenticationMiddleware, studentController_1.getAllstudents)
    .post(authenticateUser_1.authenticationMiddleware, studentController_1.createStudent);
router
    .route("/:id")
    .get(authenticateUser_1.authenticationMiddleware, studentController_1.getSingleStudent)
    .patch(authenticateUser_1.authenticationMiddleware, studentController_1.updateStudent)
    .delete(authenticateUser_1.authenticationMiddleware, studentController_1.deleteStudent);
