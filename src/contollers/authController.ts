import { School } from "../models/mergerModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const register = async (req: Request, res: Response) => {
  const { schoolName, password, location, schoolImage, schoolID } = req.body;

  const alreadyExist = await School.findOne({ where: { schoolName } });

  if (alreadyExist) {
    res
      .status(StatusCodes.CONFLICT)
      .send({ msg: "This user already exists!!!!" });
  }
  if (!alreadyExist) {
    try {
      const school = await School.create({
        schoolName,
        password,
        location,
        schoolID,
        schoolImage,
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
