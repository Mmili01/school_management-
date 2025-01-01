import { Op } from "sequelize";
import { Department } from "../models/departmentModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";

export const createDepartment = async (req: Request, res: Response) => {
  const { departmentName, departmentId, initials, yearsOfStudy, facultyCode } =
    req.body;
  console.log(departmentName);

  const alreadyExist = await Department.findOne({ where: { departmentName } });

  if (alreadyExist) {
    res.status(StatusCodes.CONFLICT).send({ msg: "Department already exists" });
  }

  if (!alreadyExist) {
    try {
      const department = await Department.create({
        ...req.body,
      });
      res.status(StatusCodes.OK).send({ msg: department });
      console.log(department);
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "Error creating department" });
    }
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const { facultyCode } = req.body;

    const departments = await Department.findAll({ where: { facultyCode } });

    if (departments.length === 0) {
      res
        .status(StatusCodes.OK)
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
  const departmentId = req.body;
  const department = await Department.findOne({ where: departmentId });

  if (!department) {
    res
      .status(StatusCodes.OK)
      .send({ msg: `no department with id ${departmentId}` });
  }

  res.status(StatusCodes.OK).send({ msg: department });
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  const serachCriteria = {
    [Op.or]: [
      { departmentName: identifier },
      { departmentId: identifier },
      { initials: identifier },
      { yearsOfStudy: identifier },
      { facultyCode: identifier },
    ],
  };
  const departmentDetails = await Department.findOne({
    where: serachCriteria,
  });
  try {
    if (!departmentDetails) {
      throw new BadRequestError(`${identifier} not found`);
    }
    departmentDetails.update({ ...req.body });
    const updatedDepartment = await departmentDetails.save();
    res.status(StatusCodes.OK).send({ msg: updatedDepartment });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "there was an error updating department" });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const departmentName = req.body;
  try {
    const department = await Department.destroy({ where: departmentName });

    if (!department) {
      res
        .status(StatusCodes.OK)
        .send({ msg: `no department with name ${departmentName}` });
    }

    res
      .status(StatusCodes.OK)
      .send({ msg: `Department deleted successfully ` });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "error deleting department" });
  }
};
