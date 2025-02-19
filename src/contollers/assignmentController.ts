import { Assignment } from "../models/assignmentModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, Conflict, NotFoundError } from "../errors";
import { Department } from "../models/departmentModel";
import { Faculty } from "../models/facultyModel";
import { Student } from "../models/mergerModel";
import { Submission } from "../models/submissionModel";

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
      .json({ msg: "There was an error creating assignment", error });
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
      .json({ Msg: "There was an error fethching assignments ", error });
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
      .json({ msg: "There was an error fetching assignment", error });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  const { title, description, dueDate } = req.body;

  try {
    const assignment = await Assignment.findOne({ where: { id: identifier } });
    if (!assignment) {
      throw new BadRequestError("Assignment does not exist ");
    }
    const updatedAssignment = await assignment.update({ ...req.body });
    res
      .status(StatusCodes.OK)
      .json({ updatedAssignment, msg: "Assignment updated successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error updating assignment ", error });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  try {
    const assignment = await Assignment.findOne({ where: { id: identifier } });
    if (!assignment) {
      throw new BadRequestError("Assignment not found");
    }
    await assignment.destroy();
    await assignment.reload();
    res.status(StatusCodes.OK).json({ msg: "Assignment deletes successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error deleting assignment", error });
  }
};

export const submitAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;
  const { studentId, submission, submissionDate } = req.body;

  const submittedAssignment = await Submission.findOne({where:{id:assignmentId}})

  try {
    const assignment = await Assignment.findByPk(assignmentId);
    const student = await Student.findByPk(studentId);

    if (!assignment || !student) {
      throw new NotFoundError("Assignment or student not found");
    }
    const dueDate = assignment.dueDate;
    if (submissionDate > dueDate) {
      throw new BadRequestError(
        "You cannot submit this assignment because the date of submission has passed "
      );
    }

    await submission.create(submission, assignmentId, studentId);
   if (submittedAssignment){
    throw new BadRequestError("Assignment already submitted before")
   }
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Assignment submitted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error submitting assignment", error });
  }
};
