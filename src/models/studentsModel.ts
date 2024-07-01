import { Sequelize, DataTypes, Model,Optional } from "sequelize";
import { sequelize } from "../db/connectpg";
import { User } from "./userModel";
import { Department } from "./departmentModel";
import {generateRegNumber} from "../utils/generateRegNumber"

interface StudentAttributes {
  regNumber: string;
  CGPA: number;
  Assignments?: string;
  level: number;
  studentemail: string;
  userId: number;
  departmentId: number;
}
interface StudentCreationAttributes extends Optional<StudentAttributes, "regNumber" |  "CGPA" | "Assignments" | "level"> {}
class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  static departmentId(departmentId: any) {
    throw new Error("Method not implemented.");
  }
  declare regNumber: string;
  declare CGPA: number;
  declare Assignments?: string;
  declare level: number;
  declare studentemail: string;
  declare userId: number;
  declare departmentId: number;
  static hooks = {
    beforeCreate: async (student: Student) => {
      // const user = await User.findByPk(student.userId);
      student.regNumber = await generateRegNumber(student.departmentId)
    },

     associate(models: any) {
      Student.belongsTo(models.User, { foreignKey: "userId" });
      Student.belongsTo(models.Department, { foreignKey: "departmentId" });
    }
  };
}

Student.init(
  {
    regNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    CGPA: {
      type: DataTypes.FLOAT,
      defaultValue: 5.0,
    },
    Assignments: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    studentemail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
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
  },
  {
    sequelize,
    modelName: "Student",
  }
);

export { Student };
