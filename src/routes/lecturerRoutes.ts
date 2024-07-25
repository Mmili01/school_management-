import express from "express";
import {
  createLecturer,
  getAllLecturers,
  updateLecturer,
  getSingleLecturer,
  deleteLecturer,
} from "../contollers/lecturerController";
import { authenticationMiddleware } from "../middleware/authenticateUser";

const router = express.Router();

router
  .route("/")
  .post(authenticationMiddleware, createLecturer)
  .get(authenticationMiddleware, getAllLecturers);
router
  .route("/:id")
  .get(authenticationMiddleware, getSingleLecturer)
  .patch(authenticationMiddleware, updateLecturer)
  .delete(authenticationMiddleware, deleteLecturer);

  export default router