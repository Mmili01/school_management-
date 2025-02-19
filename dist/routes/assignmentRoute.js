"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignmentController_1 = require("../contollers/assignmentController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const router = express_1.default.Router();
router
    .route("/")
    .post([authenticateUser_1.authenticationMiddleware, (0, authenticateUser_1.authorizePermissions)("lecturer")], assignmentController_1.createAssignment)
    .get([authenticateUser_1.authenticationMiddleware, (0, authenticateUser_1.authorizePermissions)("lecturer", "student")], assignmentController_1.getAllAssignments);
router
    .route("/:id")
    .get([authenticateUser_1.authenticationMiddleware, (0, authenticateUser_1.authorizePermissions)("lecturer", "student")], assignmentController_1.getSingleAssignment)
    .patch([authenticateUser_1.authenticationMiddleware, (0, authenticateUser_1.authorizePermissions)("lecturer")], assignmentController_1.updateAssignment)
    .delete([authenticateUser_1.authenticationMiddleware, (0, authenticateUser_1.authorizePermissions)("lecturer")], assignmentController_1.deleteAssignment);
exports.default = router;
