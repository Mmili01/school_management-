import { Request, Response } from "express";
import { User, Student, School,Lecturer } from "../models/mergerModel";
import { generateLecturerEmail } from "../utils/lecturerEmail";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

export const createLecturer = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    surname,
    password,
    schoolName,
    departmentId,
    schoolEmailExtension,
    level,
    position,
    lecturerId

  } = req.body;
  try {
    const school = await School.findOne({
      where: { emailExtension: schoolEmailExtension },
    });
    if (!school) {
      throw new BadRequestError("school email extension doesn't exist");
    }
    const schoolName = school.schoolName;

    // Generate temporary password and hash
    const email = generateLecturerEmail(
      firstName,
      lastName,
      surname,
      schoolName
    );
    const temporaryPassword = uuidv4();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    // Create User
    const user = await User.create({
      firstName,
      lastName,
      surname,
      password: passwordHash, // Hashed password
      userType: "lecturer",
      schoolName: schoolName, 
    });

    
    const lecturer = await Lecturer.create({
      userId: user.id,
      departmentId,
      lecturerEmail: email,
      level,
      position,
      lecturerId
    });

    // Generate Admission Link 
    const admissionLink = `https://schooldomainname/admission/${lecturer.userId}`;

    res
      .status(StatusCodes.OK)
      .send({ msg: "Student created successfully", lecturer, admissionLink });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "There was an error creating student" });
  }
};

export const getAllLecturers = async (req: Request, res: Response) => {
  const { identifier } = req.body;
  const serachCriteria = {
    [Op.or]: [
      { facultyName: identifier },
      { schoolName: identifier },
      { departmentName: identifier },
    ],
  };
  try {
    const lecturers = await Lecturer.findAll({ where: serachCriteria });
    res.status(StatusCodes.OK).send({ msg: lecturers });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "There was a problem fetching Lecturers " });
  }
};

export const getSingleLecturer = async (req: Request, res: Response) => {
  const { identifier } = req.body;

  const searchCriteria = {
    [Op.or]: [
      { firstName: identifier },
      { lastName: identifier },
      { regNumber: identifier },
    ],
  };
  try {
    const lecturer = await Lecturer.findOne({ where: searchCriteria });
    if (!lecturer) {
      res.status(StatusCodes.OK).send({ msg: "No Student found" });
    }
    res.status(StatusCodes.OK).send({ msg: lecturer });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "There was an error fetching student " });
  }
};

export const updateLecturer = async (req: Request, res: Response) => {
  const { identifier } = req.body;

  const serachCriteria = {
    [Op.or]: [
      { facultyName: identifier },
      { facultyCode: identifier },
      { location: identifier },
    ],
  };

  const studentDetails = await Student.findOne({ where: serachCriteria });
  try {
    if (!studentDetails) {
      throw new BadRequestError(`${serachCriteria} not found`);
    }
    studentDetails.update({ ...req.body });
    const updatdedStudent = await studentDetails.save();
    res.status(StatusCodes.OK).send({ msg: updatdedStudent });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "There was an error updating student" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const identifier = req.body;
  const searchCriteria = {
    [Op.or]: [
      { regNumber: identifier },
      { firstName: identifier },
      { lastName: identifier },
    ],
  };
  const student = await Student.destroy({ where: searchCriteria });
  try {
    if (!student) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ msg: "No student with such identifier" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "There was an error deleting student" });
  }
};
