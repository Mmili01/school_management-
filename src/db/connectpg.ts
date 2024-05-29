const { Sequelize } = require("sequelize");
import {
  User,
  Student,
  Lecturer,
  Faculty,
  Course,
  School,
  Department,
} from "../models/mergerModel";
import * as dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URI, {
  dialect: "postgres",
  logging: false,
}); // Example for postgres

export const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync();
    console.log("Database synced.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  // sequelize.close();
};
