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
import { UUIDV4 } from "sequelize";

class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  static departmentId(departmentId: any) {
    throw new Error("Method not implemented.");
  }
  declare id: CreationOptional<string>;
  declare regNumber: CreationOptional<string>;
  declare CGPA: CreationOptional<number>;
  declare Assignments?: CreationOptional<string>;
  declare level: CreationOptional<number>;
  declare studentemail: string;
  declare userId: ForeignKey<string>;
  declare departmentId: ForeignKey<number>;
  declare departmentName: ForeignKey<string>;
  static hooks = {
    beforeCreate: async (student: Student) => {
      student.regNumber = await generateRegNumber(student.departmentId);
    },

    associate() {
      Student.belongsTo(User, { targetKey: "userId" });
      Student.belongsTo(Department, { targetKey: "departmentId" });
      Student.belongsTo(Department, { targetKey: "departmentName" });
    },
  };
}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4, 
      allowNull: false,
    },
    regNumber: {
     type:DataTypes.STRING,
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
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Student",
  }
);

export { Student };
