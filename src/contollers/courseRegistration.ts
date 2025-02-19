import { Request, Response } from "express";
import { Enrollment } from "../models/enrollmentModel";
import { Student } from "../models/studentsModel";
import { Course } from "../models/courseModel";
import { BadRequestError, NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";

export const enrollCourse = async (req: Request, res: Response) => {
  const { studentId, courseId } = req.body;
  try {
    const student = await Student.findByPk(studentId);
    const course = await Course.findByPk(courseId);

    //checking for student and course
    if (!student || !course) {
      throw new NotFoundError("Student or Course does not exist");
    }

    const alreadyExist = await Enrollment.findOne({
      where: { studentId, courseId },
    });
    if (alreadyExist) {
      throw new BadRequestError("You have already registered for this course");
    }

    const enrollment = await Enrollment.create(studentId, courseId);
    res.status(StatusCodes.CREATED).json({
      msg: "You have successfully registered this course",
      enrollment,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error registering the course", error });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const enrollmentId = req.params.id;

  try {
    const enrollment = await Enrollment.findByPk(enrollmentId);
    if (!enrollment) {
      throw new NotFoundError(
        "You have not registetred for this course before"
      );
    }

    await enrollment.destroy();
    res
      .status(StatusCodes.NO_CONTENT)
      .json({ msg: "Course deleted from registered courses" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error deleting course", error });
  }
};

export const getStudentEnrollments = async (req: Request, res: Response) => {
  const { regNumber } = req.body;

  try {
    const enrollment = await Enrollment.findAll({
      where: { regNumber },
      include: [{ model: Course }],
    });
    if (!enrollment) {
      throw new NotFoundError("You have not registered for any course ");
    }
    res
      .status(StatusCodes.OK)
      .json({ msg: "Here are the registered courses", enrollment });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error fetching registered courses ", error });
  }
};

// getting the number of people that registered a course
export const getCourseEnrollments = async (req: Request, res: Response) => {
  const { courseId } = req.body;

  try {
    const enrollment = await Enrollment.findAll({
      where: { courseId },
      include: [{ model: Student }],
    });
    if (!enrollment) {
      throw new NotFoundError("No student registered for this course yet ");
    }
    res
      .status(StatusCodes.OK)
      .json({
        msg: "Here is the list of students that registered for this course ",
        enrollment,
      });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error fetching studentss ", error });
  }
};
