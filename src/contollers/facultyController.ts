import { Request, Response } from "express";
import { Faculty } from "../models/facultyModel";
import { StatusCodes } from "http-status-codes";

export const createFaculty = async (req: Request, res: Response) => {
  const { facultyName, facultyCode, location } = req.body;

  const alreadyExist = await Faculty.findOne({ where: { facultyName } });
  if (alreadyExist) {
    res.status(StatusCodes.CONFLICT).send({ msg: "Faculty already exists" });
  }

  if (!alreadyExist) {
    try {
      const faculty = await Faculty.create({
        facultyName,
        facultyCode,
        location,
      });
      res.status(StatusCodes.OK).send({ msg: faculty });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "There was an issue creating the faculty " });
    }
  }
};
