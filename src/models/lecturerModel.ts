import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";
import { Department } from "./departmentModel";
import { User } from "./userModel";

interface LecturerAttribute {
  level: string;
  position: string;
  lecturerId: string;
  userId:number;
  departmentId:number
  lecturerEmail:string
}
class Lecturer extends Model<LecturerAttribute> implements LecturerAttribute {
  level!: string;
  position!: string;
  lecturerId!: string;
  userId!:number;
  departmentId!:number
  lecturerEmail!:string
}
Lecturer.init(
  {
    level: {
      type: DataTypes.STRING,
      defaultValue:"Lecturer II"
    },
    position: {
      type: DataTypes.STRING,
    },
    lecturerId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Department,
        key: "departmentId",
      },
    },
    lecturerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

  },
  {
    sequelize,
    modelName: "Lecturer",
  },
 
);

export {Lecturer}