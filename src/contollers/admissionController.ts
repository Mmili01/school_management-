// import { Request, Response } from "express";
// import { User } from "../models/userModel";
// import { Student } from "../models/studentsModel";
// import { School } from "../models/mergerModel";
// import { generateStudentGmail } from "../utils/studentemail";
// import * as bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";
// import { BadRequestError } from "../errors";
// import { StatusCodes } from "http-status-codes";

// export const offerAdmission = async (req: Request, res: Response) => {
//   const {
//     emailExtension,
//     firstName,
//     lastName,
//     surname,
//     departmentId,
//     schoolName,
//   } = req.body;
//   try {
//     const school = School.findOne({ where: { emailExtension } });
//     if (!school) {
//       throw new BadRequestError("school email extension doesn't exist");
//     }

//     const email = generateStudentGmail(
//       firstName,
//       lastName,
//       surname,
//       emailExtension
//     );
//     const temporaryPassword = uuidv4();
//     const password = await bcrypt.hash(temporaryPassword, 10);

//     const newUser = await User.create({
//       ...req.body,
//     });

//     const newStudent = await Student.create({
//       userId: newUser.id,
//       departmentId: departmentId,
//       studentemail: email,
      
//     });

//     const admissionLink = `https://schooldomainname/admission/${newStudent.userId}`;
//     res.status(StatusCodes.OK).send({
//       msg: "Admission offered sucessfully ",
//       newStudent,
//       admissionLink,
//     });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send("there was an error offering admission ");
//   }
// };
