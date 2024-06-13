import { Request, Response } from "express";
import { Faculty } from "../models/facultyModel";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { BadRequestError } from "../errors";

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

export const getAllFaculties = async (req: Request, res: Response) => {
  const schoolName = req.body;
  const faculties = await Faculty.findAll({ where: { schoolName } });

  res.status(StatusCodes.OK).send(faculties);
};

export const getSingleFaculty = async (req: Request, res: Response) => {
  const facultyName = req.body;
  try {
    const faculty = await Faculty.findOne({ where: { facultyName } });
    if (!faculty) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ msg: `No faculty with name ${faculty}` });
    }
    res.status(StatusCodes.OK).send({ msg: faculty });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Error fetching faculty" });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  const { identifier } = req.body;

  const serachCriteria = {
    [Op.or]: [
      { facultyName: identifier },
      { facultyCode: identifier },
      { location: identifier },
    ],
  };

  const facultyDetails = await Faculty.findOne({ where: serachCriteria });
  try {
    if (!facultyDetails) {
      throw new BadRequestError(`${serachCriteria} not found`);
    }
    facultyDetails.update({ ...req.body });
    const updatdedFaculty = await facultyDetails.save();
    res.status(StatusCodes.OK).send({ msg: updatdedFaculty });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Error updating faculty" });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  const facultyName = req.body;
  const faculty = await Faculty.destroy({ where: { facultyName } });
  try {
    if (!faculty) {
      throw new BadRequestError("Faculty not found");
    }
    res.status(StatusCodes.OK).send({ msg: "Faculty deleted sucessfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Error deleting faculty" });
  }
};
