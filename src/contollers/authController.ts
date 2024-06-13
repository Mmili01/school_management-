import { School } from "../models/mergerModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorisedError } from "../errors";
import { generateGmailExtension } from "../utils/schoolgmail";

export const register = async (req: Request, res: Response) => {
  const {
    schoolName,
    password,
    location,
   faculties,
    schoolID,
    schoolType,

  } = req.body;

  const alreadyExist = await School.findOne({ where: { schoolName } });

  if (alreadyExist) {
    res
      .status(StatusCodes.CONFLICT)
      .send({ msg: "This user already exists!!!!" });
  }
  if (!alreadyExist) {
    try {
      const gmailExtension = generateGmailExtension(schoolName);
      const school = await School.create({
        schoolName,
        password,
        location,
        schoolID,
        faculties,
        schoolType,
        gmailExtension,
      });

      res.status(StatusCodes.OK).send({ msg: school });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "There was an error creating user" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { schoolName, password } = req.body;
  if (!schoolName || !password) {
    throw new BadRequestError("parameters cannot be empty ");
  }
  const school = await School.findOne({ where: { schoolName } });
  if (!school) {
    throw new UnauthorisedError("Username or password incorrect");
  }
  const isPasswordValid = school.validPassword(password);

  if (!isPasswordValid) {
    throw new UnauthorisedError("Username or password incorrect");
  }

  res.status(StatusCodes.OK).send({ msg: "Login successful" });
};
