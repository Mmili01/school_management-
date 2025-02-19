import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { NotFoundError, UnauthorisedError } from "../errors";
import * as dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
dotenv.config();

export const authenticationMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new NotFoundError("Token not found");
  }
  const token = authHeader.split(" ")[1];

  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY as string);
    const schoolName = decoded;
    req.user = schoolName as string;
    next();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    console.log(error);
  }
};

export const authorizePermissions = (...roles: any[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.userType)) {
      throw new UnauthorisedError("Not Authorised to access this route");
    }
    console.log(req.user.userType);

    next();
  };
};
