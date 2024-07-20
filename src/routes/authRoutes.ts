import express from "express";
import { login, register } from "../contollers/authController";
export const router = express.Router();

router.post("/register", register);
router.post("/login", login);


