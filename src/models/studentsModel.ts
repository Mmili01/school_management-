import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../db/connectpg";
import { User } from "./userModel";
import { Department } from "./departmentModel";
import { generateRegNumber } from "../utils/generateRegNumber";

class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  static departmentId(departmentId: any) {
    throw new Error("Method not implemented.");
  }
  declare regNumber: CreationOptional<string>;
  declare CGPA: CreationOptional<number>;
  declare Assignments?: CreationOptional<string>;
  declare level: CreationOptional<number>;
  declare studentemail: string;
  declare userId: ForeignKey<number>;
  declare departmentId: ForeignKey<number>;
  static hooks = {
    beforeCreate: async (student: Student) => {
      student.regNumber = await generateRegNumber(student.departmentId);
    },

    associate() {
      Student.belongsTo(User, { targetKey: "userId" });
      Student.belongsTo(Department, { targetKey: "departmentId" });
    },
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
      defaultValue: 100,
    },
    studentemail: {
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
    modelName: "Student",
  }
);

export { Student };
