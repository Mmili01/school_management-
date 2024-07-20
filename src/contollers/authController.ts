import { School } from "../models/mergerModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthorisedError } from "../errors";
import { generateGmailExtension } from "../utils/schoolgmail";
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv";
dotenv.config();


interface jwtPayload {
  schoolName:string
}
export const register = async (req: Request, res: Response) => {
  const {
    schoolName,
    password,
    location,

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
      const emailExtension = generateGmailExtension(schoolName);
      const school = await School.create({
        schoolName,
        password,
        location,
        schoolID,
        
        schoolType,
        emailExtension,
      });
      const payload: jwtPayload = { schoolName }; // Use correct type
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "30d" });
    res.status(StatusCodes.OK).json({ msg: "School created successfully", token });
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
const authHeader = req.headers.authorization
if (!authHeader || !authHeader.startsWith('Bearer ')){
  throw new NotFoundError("Token not found")
}
  const token  = authHeader?.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY as string)
  } catch (error) {
     throw new UnauthorisedError("Not authorised to access this route")
  }
  res.status(StatusCodes.OK).send({ msg: "Login successful" });
};

