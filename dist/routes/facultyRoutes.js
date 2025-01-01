"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facultyController_1 = require("../contollers/facultyController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const router = express_1.default.Router();
router
    .route("/")
    .post(authenticateUser_1.authenticationMiddleware, facultyController_1.createFaculty)
    .get(authenticateUser_1.authenticationMiddleware, facultyController_1.getAllFaculties);
router
    .route("/:id")
    .get(authenticateUser_1.authenticationMiddleware, facultyController_1.getSingleFaculty)
    .patch(authenticateUser_1.authenticationMiddleware, facultyController_1.updateFaculty)
    .delete(authenticateUser_1.authenticationMiddleware, facultyController_1.deleteFaculty);
exports.default = router;
