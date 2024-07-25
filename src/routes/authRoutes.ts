import express from "express";
import { login, register } from "../contollers/authController";
 const router = express.Router();

router.route("/register").post(register);
router.route("/logn").post(login);

export default router