import express from "express";
import {
  createAssignment,
  getSingleAssignment,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
} from "../contollers/assignmentController";
import { authenticationMiddleware,authorizePermissions } from "../middleware/authenticateUser";

const router = express.Router();

router
  .route("/")
  .post([authenticationMiddleware, authorizePermissions("lecturer")],createAssignment)
  .get([authenticationMiddleware, authorizePermissions("lecturer", "student")],getAllAssignments);

router
  .route("/:id")
  .get([authenticationMiddleware,authorizePermissions("lecturer", "student") ],getSingleAssignment)
  .patch([authenticationMiddleware, authorizePermissions("lecturer") ],updateAssignment)
  .delete([authenticationMiddleware, authorizePermissions("lecturer")],deleteAssignment);

  export default router