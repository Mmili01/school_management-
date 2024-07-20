"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const facultyController_1 = require("../contollers/facultyController");
const router = express_1.default.Router();
exports.router = router;
router.route("/").post(facultyController_1.createFaculty).get(facultyController_1.getAllFaculties);
router.route("/:id").get(facultyController_1.getSingleFaculty).patch(facultyController_1.updateFaculty).delete(facultyController_1.deleteFaculty);
