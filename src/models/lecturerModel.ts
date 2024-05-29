import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";

interface LecturerAttribute {
  level: string;
  position: string;
  lecturerId: string;
}
class Lecturer extends Model<LecturerAttribute> implements LecturerAttribute {
  level!: string;
  position!: string;
  lecturerId!: string;
}
Lecturer.init(
  {
    level: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    lecturerId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Lecturer",
  }
);

export {Lecturer}