import { Request, Response } from "express";
import { Results } from "../models/resultModel";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors";
import { calculateScore } from "../utils/calculateResult";

export const inputResult = async (req: Request, res: Response) => {
  const { courseId, regNumber, dateRecorded, feedback, score } = req.body;
  const grade = calculateScore(score);
  try {
    const existingResult = await Results.findOne({
      where: { courseId, regNumber },
    });
    if (existingResult) {
      await existingResult.update({ score });
      res
        .status(StatusCodes.OK)
        .json({ msg: "Results updated successfully", existingResult });
    } else {
      const result = await Results.create({
        regNumber,
        grade,
        courseId,
        dateRecorded,
        feedback,
        score,
      });
      res
        .status(StatusCodes.OK)
        .json({ msg: "Result created successfully", result });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error creating the result", error });
  }
};

export const getResult = async (req: Request, res: Response) => {
  const { regNumber } = req.body;
  try {
    const result = await Results.findOne({ where: { regNumber } });
    if (!result) {
      throw new NotFoundError("Results not found");
    }
    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error fetching result", error });
  }
};

export const getCourseResults = async (req: Request, res: Response) => {
  const { courseId } = req.body;
  try {
    const result = await Results.findOne({ where: courseId });
    if (!courseId) {
      throw new NotFoundError("There are no results for this course yet");
    }
    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error fetching results", error });
  }
};
