import express from "express";
import {
  createDepartment,
  getSingleDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../contollers/departmentsController";
import { authenticationMiddleware } from "../middleware/authenticateUser";

const router = express.Router();
router
  .route("/")
  .post(authenticationMiddleware, createDepartment)
  .get(authenticationMiddleware, getAllDepartments);
router
  .route("/:id")
  .get(authenticationMiddleware, getSingleDepartment)
  .patch(authenticationMiddleware, updateDepartment)
  .delete(authenticationMiddleware, deleteDepartment);

export default router;
