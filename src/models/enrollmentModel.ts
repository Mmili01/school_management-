import { sequelize } from "../db/connectpg";
import {
  DataType,
  Model,
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes,
} from "sequelize";
import { Course } from "../models/courseModel";
import { Student } from "../models/studentsModel";

class Enrollment extends Model<
  InferAttributes<Enrollment>,
  InferCreationAttributes<Enrollment>
> {
  declare id: CreationOptional<string>;
  declare studentId: ForeignKey<string>;
  declare courseId: ForeignKey<string>;
  declare regNumber: ForeignKey<number>;
  declare enrollmentDate: Date;

  associate() {
    Student.belongsToMany(Course, { through: Enrollment });
    Course.belongsToMany(Student, { through: Enrollment });
  }
}

Enrollment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    enrollmentDate: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, modelName: "Enrolment" }
);


export {Enrollment}
