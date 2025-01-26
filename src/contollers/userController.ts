// import { User } from "../models/userModel";
// import { Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import { Op } from "sequelize";
// import { BadRequestError } from "../errors/bad-request";

// export const createUser = async (req: Request, res: Response) => {
//   const {
//     firstName,
//     lastName,
//     surname,
//     password,
//     userType,
//     schoolName,
//     email,
//   } = req.body;
//   try {
//     const user = await User.create({
//       firstName,
//       lastName,
//       surname,
//       password,
//       userType,
//       schoolName,
//       email,
//     });
//     res.status(StatusCodes.OK).send({ msg: user });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "There was an error creating user" });
//   }
// };

// export const getAllUsers = async (req: Request, res: Response) => {
//   const schoolName = req.body;
//   try {
//     const users = await User.findAll({ where: { schoolName } });
//     res.status(StatusCodes.OK).send({ msg: users });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "There was an error fetching user" });
//   }
// };

// export const getSingleUser = async (req: Request, res: Response) => {
//   const { firstName, surname } = req.body;

//   try {
//     const user = await User.findOne({ where: { firstName, surname } });
//     if (!user) {
//       res.send({ msg: `${user} not found` });
//     }
//     res.status(StatusCodes.OK).send({ msg: user });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "Error fetching user" });
//   }
// };

// export const updateUser = async (req: Request, res: Response) => {
//   const identifier = req.body;
//   const searchCriteria = {
//     [Op.or]: [
//       { firstName: identifier },
//       { lastName: identifier },
//       { surname: identifier },
//     ],
//   };
//   const userDetails = await User.findOne({ where: searchCriteria });
//   try {
//     if (!userDetails) {
//       throw new BadRequestError(`${searchCriteria} not found`);
//     }
//     userDetails.update({ ...req.body });
//     const updatdedUser = await userDetails.save();

//     res.status(StatusCodes.OK).send({ msg: updatdedUser });
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "There was an error updating user" });
//   }
// };

// export const deleteUser = async (req: Request, res: Response) => {
//   const { firstName, surname } = req.body;

//   const user = await User.findOne({ where: { firstName, surname } });
//   try {
//     if (!user) {
//       throw new BadRequestError("User not found");
//     }
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .send({ msg: "Error deleting user" });
//   }
// };
