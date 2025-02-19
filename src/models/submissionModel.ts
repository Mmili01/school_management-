import { ForeignKey, UUIDV4 } from "sequelize";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../db/connectpg";
import { Assignment } from "./assignmentModel";
import { Student } from "./studentsModel";
class Submission extends Model<
  InferAttributes<Submission>,
  InferCreationAttributes<Submission>
> {
  declare id: CreationOptional<string>;
  declare assignmentId: ForeignKey<number>;
  declare studentId: ForeignKey<number>;
  declare submissionContent: string;
  declare submissionDate: Date;

  associate() {
    Submission.belongsTo(Assignment, { targetKey: "assignmentId" });
    Submission.belongsTo(Student, { targetKey: "studentId" });
  }
}

Submission.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    submissionContent: {
      type: DataTypes.TEXT,
    },
    submissionDate: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, modelName: "Submission" }
);

export { Submission };
