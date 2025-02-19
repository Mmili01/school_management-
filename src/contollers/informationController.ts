import { Information } from "../models/informationModel";
import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";

export const createNews = async (req: Request, res: Response) => {
  const { headline, body, postDate } = req.body;

  try {
    if (!headline || !body || !postDate) {
      throw new BadRequestError("Parameters cannot be empty");
    }
    const information = await Information.create({ headline, body, postDate });
    res.status(StatusCodes.OK).json({ information });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error creating news ", error });
  }
};

export const getNews = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  try {
    const news = await Information.findOne({ where: { id: identifier } });
    if (!news) {
      throw new NotFoundError("Information not available ");
    }
    res.status(StatusCodes.OK).json({ news });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error fetching information" });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  const allowedFields = ["headline", "body", "postdate"];

  try {
    const news = await Information.findOne({ where: { id: identifier } });
    if (!news) {
      throw new NotFoundError("Information not found");
    }

    // filter allowed feilds
    const updateData = Object.keys(req.body)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj: any, key: any) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    //check if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "No valid fields to update",
      });
    }
    await news.update(updateData);
    await news.reload();

    res.status(StatusCodes.OK).json({ msg: "Information updated", news });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error updating information ", error });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  const identifier = req.params.id;
  try {
    const news = await Information.findOne({ where: { id: identifier } });
    if (!news) {
      throw new NotFoundError("Information not found");
    }
    await news.destroy();
    res
      .status(StatusCodes.OK)
      .json({ msg: "Information deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "There was an error deleting information", error });
  }
};
