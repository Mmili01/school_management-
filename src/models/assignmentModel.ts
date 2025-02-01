import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/connectpg";
import { Department } from "./departmentModel";
import { Faculty } from "./facultyModel";
import { Lecturer } from "./lecturerModel";
import { Student } from "./studentsModel";

class Assignment extends Model<
  InferAttributes<Assignment>,
  InferCreationAttributes<Assignment>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare dueDate: Date;
  declare facultyCode: number;
  declare departmentId: number;

  associate() {
    Assignment.belongsTo(Student, { targetKey: "StudentId" });
    Assignment.belongsTo(Lecturer, { targetKey: "LecturerId" });
    Assignment.belongsTo(Department, { targetKey: "DepartmentId" });
    Assignment.belongsTo(Faculty, { targetKey: "FacultyId" });
  }
}

Assignment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    facultyCode: {
      type: DataTypes.STRING,
    },
    departmentId: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, tableName: "Assignment" }
);

export { Assignment };
