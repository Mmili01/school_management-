
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorisedError } from "../errors";
import { User } from "../models/userModel";

interface jwtPayload {
  id: string;
}

export const studentsLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please input email and password" });
  }
  try {
    const username = await User.findOne({ where: { email: email } });
    if (!username) {
      throw new UnauthorisedError("Username or Password incorrect");
    }
    const isPasswordValid = username.validPassword(password);
    if (!isPasswordValid) {
      throw new UnauthorisedError("Username or passowrd invalid");
    }
    console.log(typeof username);

    const identity = username.id;
    const payload: jwtPayload = { id: identity };
    const token = jwt.sign(payload, process.env.SECRETEKEY as string, {
      expiresIn: "30d",
    });
    res.status(StatusCodes.OK).json({ msg: "login successful", token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error logging in " });
  }
};

export const logout = async (req:Request, res:Response) => {
    res.cookie("token", "logout"), {
       httpOnly:true,
     expires: new Date(Date.now()+ 5 *1000)
    }
   
     res.status(StatusCodes.OK).json("logged out")
   };


