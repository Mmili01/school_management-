import sequelize from "sequelize";
import { Department } from "../models/departmentModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const createDepartment = async (req: Request, res: Response) => {
  const { departmentName, departmentID, initials, yearsOfStudy } = req.body;

  const alreadyExist = await Department.findOne({ where: { departmentName } });

  if (alreadyExist) {
    res.status(StatusCodes.CONFLICT).send({ msg: "Department already exists" });
  }

  if (!alreadyExist) {
    try {
      const department = await Department.create({
        departmentName,
        departmentID,
        initials,
        yearsOfStudy,
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
