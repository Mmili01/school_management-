"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const departmentsController_1 = require("../contollers/departmentsController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const router = express_1.default.Router();
router
    .route("/")
    .post(authenticateUser_1.authenticationMiddleware, departmentsController_1.createDepartment)
    .get(authenticateUser_1.authenticationMiddleware, departmentsController_1.getAllDepartments);
router
    .route("/:id")
    .get(authenticateUser_1.authenticationMiddleware, departmentsController_1.getSingleDepartment)
    .patch(authenticateUser_1.authenticationMiddleware, departmentsController_1.updateDepartment)
    .delete(authenticateUser_1.authenticationMiddleware, departmentsController_1.deleteDepartment);
exports.default = router;
