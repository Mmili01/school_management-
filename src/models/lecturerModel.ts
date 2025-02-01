import { UUIDV4 } from "sequelize";
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
import { Department } from "./departmentModel";
import { Faculty } from "./facultyModel";
import { User } from "./userModel";

class Lecturer extends Model<
  InferAttributes<Lecturer>,
  InferCreationAttributes<Lecturer>
> {
  declare id: CreationOptional<string>;
  declare level: string;
  declare position: string;
  declare lecturerId: string;
  declare userId: ForeignKey<string>;
  declare departmentId: ForeignKey<number>;
  declare facultyName: ForeignKey<string>;
  declare facultyId: ForeignKey<number>;
  declare departmentName: ForeignKey<string>
  declare lecturerEmail: CreationOptional<string>;

  associate() {
    Lecturer.belongsTo(User, { targetKey: "userId" });
    Lecturer.belongsTo(Department, { targetKey: "departmentId" });
    Lecturer.belongsTo(Department, {targetKey:"departmentName"})
    Lecturer.belongsTo(Faculty, { targetKey: "facultyName" });
    Lecturer.belongsTo(Faculty, { foreignKey: 'facultyId' });
  }
}
Lecturer.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4, 
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      defaultValue: "Lecturer II",
    },
    position: {
      type: DataTypes.STRING,
    },
    lecturerId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    lecturerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    facultyName: { // Add this field to the initialization
      type: DataTypes.STRING,
      allowNull: true,
    },
    facultyId: {
      type : DataTypes.INTEGER,
      allowNull: true
    },
    departmentId:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    departmentName:{
      type:DataTypes.STRING,
      allowNull:true
    }
  },
  {
    sequelize,
    modelName: "Lecturer",
  }
);

export { Lecturer };
