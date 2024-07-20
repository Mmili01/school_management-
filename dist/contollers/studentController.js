"use strict";
// import { Request, Response } from "express";
// import { User, Student, School } from "../models/mergerModel";
// import { generateStudentGmail } from "../utils/studentemail";
// import * as bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";
// import { BadRequestError } from "../errors";
// import { StatusCodes } from "http-status-codes";
// import { Op } from "sequelize";
// export const createStudent = async (req: Request, res: Response) => {
//   const {
//     firstName,
//     lastName,
//     surname,
//     password,
//     schoolName,
//     departmentId,
//     schoolEmailExtension,
//   } = req.body;
//   try {
//     const school = await School.findOne({
//       where: { emailExtension: schoolEmailExtension },
//     });
//     if (!school) {
//       throw new BadRequestError("school email extension doesn't exist");
//     }
//     const schoolName = school.schoolName;
//     // Generate temporary password and hash
//     const email = generateStudentGmail(
//       firstName,
//       lastName,
//       surname,
//       schoolName
//     );
//     const temporaryPassword = uuidv4();
//     const passwordHash = await bcrypt.hash(temporaryPassword, 10);
//     // Create User
//     const user = await User.create({
//       firstName,
//       lastName,
//       surname,
//       password: passwordHash, // Hashed password
//       userType: "student",
//       schoolName: schoolName, // Assuming school name is retrieved elsewhere
//     });
//     // Create Student (associated with User)
//     const student = await Student.create({
//       userId: user.id,
//       departmentId,
//       studentemail: email,
//     });
//     // Generate Admission Link 
//     const admissionLink = `https://schooldomainname/admission/${student.userId}`;
//     res
//       .status(StatusCodes.OK)
//       .send({ msg: "Student created successfully", student, admissionLink });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "There was an error creating student" });
//   }
// };
// export const getAllstudents = async (req: Request, res: Response) => {
//   const { identifier } = req.body;
//   const serachCriteria = {
//     [Op.or]: [
//       { facultyName: identifier },
//       { schoolName: identifier },
//       { departmentName: identifier },
//     ],
//   };
//   try {
//     const students = await Student.findAll({ where: serachCriteria });
//     res.status(StatusCodes.OK).send({ msg: students });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "There was a problem fetching students " });
//   }
// };
// export const getSingleStudent = async (req: Request, res: Response) => {
//   const { identifier } = req.body;
//   const searchCriteria = {
//     [Op.or]: [
//       { firstName: identifier },
//       { lastName: identifier },
//       { regNumber: identifier },
//     ],
//   };
//   try {
//     const student = await Student.findOne({ where: searchCriteria });
//     if (!student) {
//       res.status(StatusCodes.OK).send({ msg: "No Student found" });
//     }
//     res.status(StatusCodes.OK).send({ msg: student });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "There was an error fetching student " });
//   }
// };
// export const updateStudent = async (req: Request, res: Response) => {
//   const { identifier } = req.body;
//   const serachCriteria = {
//     [Op.or]: [
//       { firstName: identifier },
//       { lastName: identifier },
//       { surname: identifier },
//       {Assignments:identifier}
//     ],
//   };
//   const studentDetails = await Student.findOne({ where: serachCriteria });
//   try {
//     if (!studentDetails) {
//       throw new BadRequestError(`${serachCriteria} not found`);
//     }
//     studentDetails.update({ ...req.body });
//     const updatdedStudent = await studentDetails.save();
//     res.status(StatusCodes.OK).send({ msg: updatdedStudent });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "There was an error updating student" });
//   }
// };
// export const deleteStudent = async (req: Request, res: Response) => {
//   const identifier = req.body;
//   const searchCriteria = {
//     [Op.or]: [
//       { regNumber: identifier },
//       { firstName: identifier },
//       { lastName: identifier },
//     ],
//   };
//   const student = await Student.destroy({ where: searchCriteria });
//   try {
//     if (!student) {
//       res
//         .status(StatusCodes.BAD_REQUEST)
//         .send({ msg: "No student with such identifier" });
//     }
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "There was an error deleting student" });
//   }
// };
