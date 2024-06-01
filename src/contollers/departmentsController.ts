import { Op } from "sequelize";
import { Department } from "../models/departmentModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";

export const createDepartment = async (req: Request, res: Response) => {
  const { departmentName, departmentId, initials, yearsOfStudy, facultyCode } =
    req.body;

  const alreadyExist = await Department.findOne({ where: { departmentName } });

  if (alreadyExist) {
    res.status(StatusCodes.CONFLICT).send({ msg: "Department already exists" });
  }

  if (!alreadyExist) {
    try {
      const department = await Department.create({
        departmentName,
        departmentId,
        initials,
        yearsOfStudy,
        facultyCode,
      });
      res.status(StatusCodes.OK).send({ msg: department });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "Error creating department" });
    }
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  const { facultyCode } = req.body;
  const departments = await Department.findByPk(facultyCode);
  if (!departments) {
    res.send({ msg: "no departments under this faculty" });
  }

  res.status(StatusCodes.OK).send({ msg: departments });
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
    departmentDetails.update({...req.body})
    const updatedDepartment = await departmentDetails.save()
    res.status(StatusCodes.OK).send({msg:updatedDepartment})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg:'there was an error updating department'})
  }
};


export const deleteDepartment = async (req: Request, res: Response) => {
  const departmentName = req.body;
  try {
    const department = await Department.destroy({ where: departmentName});

    if (!department) {
      res
        .status(StatusCodes.OK)
        .send({ msg: `no department with name ${departmentName}` });
    }
  
    res.status(StatusCodes.OK).send({ msg: `Department deleted successfully ` });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({msg:'error deleting department'})
  }
 
};