import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connectpg";

export const Faculty = sequelize.define("Faculty", {
    facultyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facultyCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  