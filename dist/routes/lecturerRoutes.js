"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturerController_1 = require("../contollers/lecturerController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const router = express_1.default.Router();
router
    .route("/")
    .post(authenticateUser_1.authenticationMiddleware, lecturerController_1.createLecturer)
    .get(authenticateUser_1.authenticationMiddleware, lecturerController_1.getAllLecturers);
router
    .route("/:id")
    .get(lecturerController_1.getSingleLecturer)
    .patch(authenticateUser_1.authenticationMiddleware, lecturerController_1.updateLecturer)
    .delete(authenticateUser_1.authenticationMiddleware, lecturerController_1.deleteLecturer);
exports.default = router;
