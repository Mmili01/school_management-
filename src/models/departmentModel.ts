import exp from "constants";
import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";

interface DepartmentAttributes {
  departmentName: string;
  departmentId: number;
  yearsOfStudy: number;
  initials: string;
}
class Department
  extends Model<DepartmentAttributes>
  implements DepartmentAttributes
{
  departmentName!: string;
  departmentId!: number;
  yearsOfStudy!: number;
  initials!: string;
}

Department.init(
  {
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
