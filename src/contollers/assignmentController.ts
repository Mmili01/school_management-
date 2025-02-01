import { Assignment } from "../models/assignmentModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, Conflict } from "../errors";
import { Department } from "../models/departmentModel";
import { Faculty } from "../models/facultyModel";

export const createAssignment = async (req: Request, res: Response) => {
  const { title, description, dueDate, departmentId, facultyCode } = req.body;
  if (!title || !description || !dueDate || !departmentId || !facultyCode) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Fill up the neccessary parameters" });
  }
  const department = await Department.findOne({ where: { departmentId } });
  if (!department) {
    throw new BadRequestError("Department doesn't exist");
  }

  const faculty = await Faculty.findOne({ where: { facultyCode } });
  if (!faculty) {
    throw new BadRequestError("Faculty doesn't exist");
  }
  const alreadyExist = await Assignment.findOne({ where: { title } });
  if (alreadyExist) {
    throw new Conflict("Assignment already exists");
  }
  try {
    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      departmentId,
      facultyCode,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ assignment, msg: "Assignment created successfully!!!" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error creating assignment" });
  }
};

export const getAllAssignments = async (req: Request, res: Response) => {
  const { facultyCode, departmentId, dueDate } = req.query;
  try {
    const serachCriteria: any = {};
    if (facultyCode) {
      serachCriteria.facultyCode = facultyCode;
    }
    if (departmentId) {
      serachCriteria.departmentId = departmentId;
    }
    if (dueDate) {
      serachCriteria.dueDate = dueDate;
    }

    const assignment = await Assignment.findAll({ where: serachCriteria });

    res
      .status(StatusCodes.OK)
      .json({ assignment, msg: "Here are the assignmets" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ Msg: "There was an error fethching assignments " });
  }
};

export const getSingleAssignment = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  try {
    const assignment = await Assignment.findOne({ where: { id: identifier } });
    if (!assignment) {
      throw new BadRequestError("Assignment does not exist ");
    }
    res.status(StatusCodes.OK).json({ assignment });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error fetching assignment" });
  }
};
