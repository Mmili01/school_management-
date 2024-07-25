import express from "express";
import {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
} from "../contollers/facultyController";
import { authenticationMiddleware } from "../middleware/authenticateUser";

const router = express.Router();
router
  .route("/")
  .post(createFaculty)
  .get(authenticationMiddleware, getAllFaculties);
router
  .route("/:id")
  .get(authenticationMiddleware, getSingleFaculty)
  .patch(authenticationMiddleware, updateFaculty)
  .delete(authenticationMiddleware, deleteFaculty);

export default router;
