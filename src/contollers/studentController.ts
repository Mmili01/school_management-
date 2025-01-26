import { Request, Response } from "express";
import { User, Student, School } from "../models/mergerModel";
import { generateStudentGmail } from "../utils/studentemail";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { generateRegNumber } from "../utils/generateRegNumber";

interface StudentSearchParams {
  identifier?: string;
  page?: number;
  limit?: number;
}
export const createStudent = async (req: Request, res: Response) => {
  console.log("in here");

  const {
    firstName,
    lastName,
    surname,
    userType,
    schoolEmailExtension,
    email,
    // student specific details
    departmentName,
    level,
    departmentId,
  } = req.body;

  try {
    if (userType !== "student") {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User is not a student" });
    }

    //create an email using school email extension
    const school = await School.findOne({
      where: { emailExtension: schoolEmailExtension },
    });
    // check if school exists
    if (!school) {
      throw new BadRequestError("school email extension doesn't exist");
    }

    // assign school name from school
    const schoolName = school.schoolName;
    console.log(schoolName);

    // Generate student email
    const semail = generateStudentGmail(
      firstName,
      lastName,
      surname,
      schoolEmailExtension
    );

    // Checking if required student-specific fields are present
    if (!departmentId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Department is required for creating a lecturer",
      });
    }

    // Generate reg number
    const studentRegNumber = await generateRegNumber(departmentId);

    // Generate temporary password
    const temporaryPassword = uuidv4();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    // Create user first
    const user = await User.create({
      firstName,
      lastName,
      surname,
      password: passwordHash,
      userType,
      schoolName: schoolName,
      email,
    });
    console.log(user);
    const student = await Student.create({
      userId: user.id,
      studentemail: semail,
      departmentId,
      departmentName,
      level,
      regNumber: studentRegNumber,
    });
    console.log(student);

    // Generate Admission Link
    const admissionLink = `https://schooldomainname/admission/${student.userId}`;

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Student created successfully",
      user,
      student,
      admissionLink,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "There was an error creating student",
      error,
    });
    console.log(error);
  }
};

export const getAllstudents = async (req: Request, res: Response) => {
  const { identifier, page = 1, limit = 10 } = req.body as StudentSearchParams;
  const offset = (page - 1) * limit;

  const searchCriteria = {
    [Op.or]: [identifier ? { departmentId: identifier } : null].filter(Boolean),
  };

  try {
    const students = await Student.findAndCountAll({
      where: searchCriteria,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    res.status(StatusCodes.OK).json({
      msg: "students created successfully  ",
      data: {
        total: students.count,
        currentPage: page,
        totalPages: Math.ceil(students.count / limit),
        students: students.rows,
      },
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was a problem fetching students ", error });
  }
};

export const getSingleStudent = async (req: Request, res: Response) => {
  const identifier = req.params.id;

  try {
    const student = await Student.findOne({ where: { id: identifier } });
    if (!student) {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "No Student found" });
    }
    res.status(StatusCodes.OK).send({ msg: student });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "There was an error fetching student " });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const identifier = req.params.id;

  const allowedFields = [
    "firstName",
    "lastName",
    "surname",
    "userType",
    "email",
    "departmentId",
    "level",
    "position",
    "lecturerId",
    "facultyName",
    "facultyId",
    "departmentName",
  ];

  const studentDetails = await Student.findOne({ where: { id: identifier } });
  try {
    if (!studentDetails) {
      throw new BadRequestError(`student with ID ${identifier} not found`);
    }

    // filter out only allowed feilds
    const updateData = Object.keys(req.body)
      .filter((key: string) => allowedFields.includes(key))
      .reduce((obj: any, key: any) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    // Check if there are any valid fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "No valid fields to update",
      });
    }
    await studentDetails.update(updateData);
    await studentDetails.reload();

    res
      .status(StatusCodes.OK)
      .send({ msg: "Student data updated successfull", studentDetails });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "There was an error updating student" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const identifier = req.params.id;

  const student = await Student.destroy({ where: { id: identifier } });
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
