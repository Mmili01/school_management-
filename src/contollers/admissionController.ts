import { Request, Response } from "express";
import { User } from "../models/userModel";
import { Student } from "../models/mergerModel";
import { School } from "../models/mergerModel";
import { generateStudentGmail } from "../utils/studentemail";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError } from "../errors";

export const offerAdmission = async (req: Request, res: Response) => {
  const { gmailExtension, studentName } = req.body;
  try {
    const school = School.findOne({ where: { gmailExtension } });
    if (!school) {
      throw new BadRequestError("school email extension doesn't exist");
    }

    const email = generateStudentGmail(gmailExtension, studentName);
    const temporaryPassword = uuidv4();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    const student = await Student.create({
      studentName,
      email,
      password: hashedPassword,
     
    });
  } catch (error) {}
};
