import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connectpg";



export const Course = sequelize.define("Course", {
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    creditLoad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM,
      values: ["first", "second"],
    },
  });