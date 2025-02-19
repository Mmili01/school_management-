import { School } from "../models/mergerModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthorisedError } from "../errors";
import { generateGmailExtension } from "../utils/schoolgmail";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface jwtPayload {
  schoolName: string;
}
export const register = async (req: Request, res: Response) => {
  const { schoolName, password, location, schoolID, schoolType } = req.body;

  const alreadyExist = await School.findOne({ where: { schoolName } });

  if (alreadyExist) {
    throw new BadRequestError("This user already exists!!!!");
  }
  if (!alreadyExist) {
    try {
      const emailExtension = generateGmailExtension(schoolName);
      const school = await School.create({
        ...req.body,
      });
      const payload: jwtPayload = { schoolName }; // Use correct type
      const token = jwt.sign(payload, process.env.SECRETKEY as string, {
        expiresIn: "30d",
      });
      res
        .status(StatusCodes.OK)
        .json({ msg: "School created successfully", token, school });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "There was an error creating user" });
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
  console.log(typeof school);

  if (!isPasswordValid) {
    throw new UnauthorisedError("Username or password incorrect");
  }
  const payload: jwtPayload = { schoolName };
  const token = jwt.sign(payload, process.env.SECRETKEY as string, {
    expiresIn: "30d",
  });
  res.status(StatusCodes.OK).json({ msg: "Login successful", token });
};

export const deleteSchool = async (req: Request, res: Response) => {
  const { schoolName } = req.body;
  const school = await School.destroy({ where: { schoolName } });
  res
    .status(StatusCodes.OK)
    .send({ msg: "School deleted successfully", school });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout"),
    {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 1000),
    };

  res.status(StatusCodes.OK).json("logged out");
};
