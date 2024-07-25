import exp from "constants";
import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../db/connectpg";
import { Faculty } from "./facultyModel";
import { Lecturer } from "./lecturerModel";
import { Student } from "./studentsModel";

class Department extends Model<
  InferAttributes<Department>,
  InferCreationAttributes<Department>
> {
  declare id: CreationOptional<number>;
  declare departmentName: string;
  declare departmentId: number;
  declare yearsOfStudy: number;
  declare initials: string;
  declare facultyCode: ForeignKey<number>;
  associate() {
    Department.hasMany(Student, {
      sourceKey: "userId",
      foreignKey: "departmentId",
    });
    Department.hasMany(Lecturer, { sourceKey: "userId" });
    Department.belongsTo(Faculty, { targetKey: "facultyCode" });
  }
}

Department.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    yearsOfStudy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    initials: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Department",
  }
);

export { Department };
