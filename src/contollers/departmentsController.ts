import { Op, where } from "sequelize";
import { Department } from "../models/departmentModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, Conflict } from "../errors";
import { Faculty } from "../models/facultyModel";

export const createDepartment = async (req: Request, res: Response) => {
  const { departmentName, departmentId, initials, yearsOfStudy, facultyCode } =
    req.body;
  console.log(departmentName);

  // Check if all required fields are present
  if (
    !departmentName ||
    !departmentId ||
    !initials ||
    !yearsOfStudy ||
    !facultyCode
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "All fields are required" });
  }

  const alreadyExist = await Department.findOne({ where: { departmentName } });

  if (alreadyExist) {
    throw new Conflict ( "Department already exists" );
  }

  if (!alreadyExist) {
    try {
      const faculty = await Faculty.findOne({where:{facultyCode}})

      if(!faculty){
        res.status(StatusCodes.BAD_REQUEST).json({msg:"Faculty does not exist"})
      }
      else{
      const department = await Department.create({
        ...req.body,
      });
      res.status(StatusCodes.OK).json({ msg: department });
      console.log(department);
    }} catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Error creating department" });
    }
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const { facultyCode } = req.body;

    const departments = await Department.findAll({ where: { facultyCode } });

    if (departments.length === 0) {
     return res
        .status(StatusCodes.NO_CONTENT)
        .json({ message: "No departments found under this faculty" });
    } else {
      res.status(StatusCodes.OK).json({ departments });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while fetching departments" });
  }
};

export const getSingleDepartment = async (req: Request, res: Response) => {
  const departmentId = req.params.id;
  try {
    const department = await Department.findOne({
      where: { id: departmentId },
    });

    if (!department) {
      throw new BadRequestError(`${department} not found`);
    } else {
      res.status(StatusCodes.OK).json({ success: true, msg: department });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "There was an error fetching department",
      error,
    });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  const allowedFields = [
    "departmentName",
    "departmentId",
    "initials",
    "yearsOfStudy",
    "facultyCode",
  ];
  const departmentDetails = await Department.findOne({
    where: { id: identifier },
  });
  try {
    if (!departmentDetails) {
      throw new BadRequestError(`${identifier} not found`);
    }
    // filter allowed fields
    const updateData = Object.keys(req.body)
      .filter((key: string) => allowedFields.includes(key))
      .reduce((obj: any, key: any) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    // check if there are any valid fields to update
    if (Object.keys(updateData).length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "There are no fields to update" });
    }
    await departmentDetails.update({ ...req.body });
    await departmentDetails.reload();

    res.status(StatusCodes.OK).send({ msg: departmentDetails });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "there was an error updating department" });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  try {
    const department = await Department.destroy({ where: { id: identifier } });

    if (!department) {
      res
        .status(StatusCodes.OK)
        .json({ msg: `no department with name ${identifier}` });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ msg: `Department deleted successfully ` });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "error deleting department" });
  }
};
