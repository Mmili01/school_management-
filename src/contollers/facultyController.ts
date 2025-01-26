import { Request, Response } from "express";
import { Faculty } from "../models/facultyModel";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { BadRequestError } from "../errors";

export const createFaculty = async (req: Request, res: Response) => {
  const { facultyName, facultyCode, location, schoolName } = req.body;

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
        schoolName,
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
  try {
    const { schoolName } = req.body;
    const faculties = await Faculty.findAll({ where: { schoolName } });

    if (faculties.length === 0) {
      res.status(StatusCodes.OK).json("There are no faculties in this school");
    } else {
      res.status(StatusCodes.OK).json(faculties);
    }
    return;
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while fetching faculties" });
  }
};

export const getSingleFaculty = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  try {
    const faculty = await Faculty.findOne({ where: { id: identifier } });
    if (!faculty) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `No faculty with name ${faculty}` });
    } else {
      res.status(StatusCodes.OK).json({ msg: faculty });
    }
    return;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching faculty" });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  const faculty = await Faculty.findOne({ where: { id: identifier } });
  const allowedFields = [
    "facultyName",
    "facultyCode",
    "location",
    "schoolName",
  ];

  const updateData = Object.keys(req.body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj: any, key: any) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  // check if there are any fields to update

  if (Object.keys(updateData).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "No valid fields to update",
    });
  }
  try {
    if (!faculty) {
      throw new BadRequestError(`${identifier} not found`);
    } else {
      faculty.update({ ...req.body });
      faculty.reload();

      res
        .status(StatusCodes.OK)
        .json({ msg: "Faculty updated successfully ", faculty });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating faculty" });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  const faculty = await Faculty.destroy({ where: { id: identifier } });
  try {
    if (!faculty) {
      throw new BadRequestError("Faculty not found");
    } else {
      res.status(StatusCodes.OK).json({ msg: "Faculty deleted sucessfully" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error deleting faculty" });
  }
};
