import { Request, Response } from "express";
import { User, Student, School, Lecturer } from "../models/mergerModel";
import { generateLecturerEmail } from "../utils/lecturerEmail";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

// I dont have to create a lecturer. I just have to get based on the filter on user model

interface LecturerSearchParams {
  identifier?: string;
  page?: number;
  limit?: number;
}
export const createLecturer = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    surname,
    userType,
    schoolEmailExtension,
    email,
    // Lecturer-specific fields
    departmentId,
    level,
    position,
    lecturerId,
    facultyName,
    facultyId,
    departmentName,
  } = req.body;

  try {
    // First, verify that the user type is actually 'lecturer'
    if (userType !== "lecturer") {
      return res.status(StatusCodes.BAD_REQUEST).send({
        msg: "Cannot create lecturer. User type is not 'lecturer'.",
      });
    }

    // create an email using school email extension
    const school = await School.findOne({
      where: { emailExtension: schoolEmailExtension },
    });
    if (!school) {
      throw new BadRequestError("school email extension doesn't exist");
    }
    const schoolName = school.schoolName;
    console.log(schoolName);

    console.log("Reached here");

    // Generate temporary password and hash
    const semail = generateLecturerEmail(
      firstName,
      lastName,
      surname,
      schoolName
    );
    const temporaryPassword = uuidv4();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    // Check if required lecturer-specific fields are present
    if (!departmentId) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        msg: "Department is required for creating a lecturer",
      });
    }

    // Create user first
    const user = await User.create({
      firstName,
      lastName,
      surname,
      password: passwordHash,
      userType,
      schoolName,
      email,
    });
    console.log(user);

    // Create lecturer, referencing the user
    const lecturer: any = await Lecturer.create({
      userId: user.id,
      departmentId,
      level,
      position,
      lecturerId,
      lecturerEmail: semail,
      facultyId,
      facultyName,
      departmentName,
    });

    //     // Generate Admission Link
    //     const admissionLink = `https://schooldomainname/admission/${lecturer.userId}`;

    res.status(StatusCodes.CREATED).send({
      msg: "Lecturer created successfully",
      user,
      lecturer,
    });
  } catch (error) {
    console.error("Error creating lecturer:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      msg: "There was an error creating lecturer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllLecturers = async (req: Request, res: Response) => {
  try {
    const {
      identifier,
      page = 1,
      limit = 10,
    } = req.body as LecturerSearchParams;

    const offset = (page - 1) * limit;

    const searchCriteria = {
      [Op.or]: [identifier ? { departmentId: identifier } : null].filter(
        Boolean
      ),
    };

    const lecturers = await Lecturer.findAndCountAll({
      where: searchCriteria,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "level",
        "position",
        "lecturerId",
        "lecturerEmail",
        "facultyName",
        "departmentName",
        "createdAt",
      ],
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Lecturers retrieved successfully",
      data: {
        total: lecturers.count,
        currentPage: page,
        totalPages: Math.ceil(lecturers.count / limit),
        lecturers: lecturers.rows,
      },
    });
  } catch (error) {
    console.error("Error in getAllLecturers", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Failed to retrieve lecturers",
      error: error || "An unexpected error occurred",
    });
  }
};

export const getSingleLecturer = async (req: Request, res: Response) => {
  const identifier = req.params.id as LecturerSearchParams;
  console.log(`${identifier} is the answer`);
  console.log(typeof identifier);
  // const searchCriteria = {
  //   [Op.or]: [identifier ? { id: identifier } : undefined].filter(Boolean),
  // };
  try {
    const lecturer = await Lecturer.findByPk();
    if (!lecturer) {
      res.status(StatusCodes.OK).json({ msg: "No Lecturer found" });
    } else {
      res.status(StatusCodes.OK).json({ msg: lecturer });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error fetching Lecturer ", error });
  }
};

export const updateLecturer = async (req: Request, res: Response) => {
  const identifier = req.params.id;

  // Define allowed fields to update
  const allowedFields = [
    'firstName',
    'lastName',
    'surname',
    'userType',
    'email',
    'departmentId',
    'level',
    'position',
    'lecturerId',
    'facultyName',
    'facultyId',
    'departmentName'
  ];

  try {
    const lecturer = await Lecturer.findByPk(identifier);

    if (!lecturer) {
      return res.status(404).json({ 
        msg: `Lecturer with id ${identifier} not found` 
      });
    }

    // Filter out only allowed fields
    const updateData = Object.keys(req.body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj:any, key:any) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    // Check if there are any valid fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        msg: "No valid fields to update" 
      });
    }

    // Update with only the allowed fields
    await lecturer.update(updateData);

    // Reload to get the most recent data
    await lecturer.reload();

    res.status(200).json({ 
      msg: "Lecturer updated successfully", 
      lecturer 
    });

  } catch (error) {
    console.error('Update Lecturer Error:', error);
    res.status(500).json({ 
      msg: "There was an error updating lecturer", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

export const deleteLecturer = async (req: Request, res: Response) => {
  const identifier = req.params;
  console.log(identifier);

  const searchCriteria = {
    [Op.or]: [{ firstName: identifier }, { lastName: identifier }],
  };
  const student = await Student.destroy({ where: searchCriteria });
  try {
    if (!student) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ msg: "No lecturer with such identifier" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "There was an error deleting student" });
  }
};
