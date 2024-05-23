import express from "express";
const router = express.Router();
import { register } from "../contollers/authController";

router.post("/register", register);

export default router;
