import exp from "constants";
import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";
import { Faculty } from "./facultyModel";

interface DepartmentAttributes {
  departmentName: string;
  departmentId: number;
  yearsOfStudy: number;
  initials: string;
  facultyCode: number;
}
class Department
  extends Model<DepartmentAttributes>
  implements DepartmentAttributes
{
  departmentName!: string;
  departmentId!: number;
  yearsOfStudy!: number;
  initials!: string;
  facultyCode!: number;
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
    facultyCode: {
      type: DataTypes.NUMBER,
      allowNull: false,
      references: {
        model: Faculty,
        key: "facultyCode",
      },
    },
  },
  {
    sequelize,
    modelName: "Department",
  }
);

export { Department };
