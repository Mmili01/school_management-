import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../db/connectpg";
import { Course } from "./courseModel";
import { Enrollment } from "./enrollmentModel";
import { Student } from "./studentsModel";

class Results extends Model<
  InferAttributes<Results>,
  InferCreationAttributes<Results>
> {
  declare id: CreationOptional<string>;
  declare courseId: ForeignKey<string>;
  declare regNumber: ForeignKey<string>;
  declare grade: string;
  declare dateRecorded: Date;
  declare feedback: Text;
  declare score :number

  associate() {
    Student.belongsToMany(Course, { through: Enrollment });
    Course.belongsToMany(Student, { through: Enrollment });

    Student.hasMany(Results);
    Course.hasMany(Results);
  }
}

Results.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateRecorded: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
    },
    score:{
      type: DataTypes.NUMBER,
      allowNull:false
    }
  },
  { sequelize, modelName: " Results" }
);

export {Results}