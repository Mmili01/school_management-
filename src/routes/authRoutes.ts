import express from "express";
import { login, register, deleteSchool } from "../contollers/authController";
 const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/deleteSchool").delete(deleteSchool)

export default router