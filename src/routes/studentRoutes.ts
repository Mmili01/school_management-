import express from "express";
import {
  createStudent,
  getAllstudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
} from "../contollers/studentController";
import { authenticationMiddleware } from "../middleware/authenticateUser";

const router = express.Router();
router
  .route("/")
  .get(authenticationMiddleware, getAllstudents)
  .post(authenticationMiddleware, createStudent);
router
  .route("/:id")
  .get(authenticationMiddleware, getSingleStudent)
  .patch(authenticationMiddleware, updateStudent)
  .delete(authenticationMiddleware, deleteStudent);

export default router ;
