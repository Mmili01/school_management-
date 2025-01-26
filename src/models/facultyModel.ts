import { UUIDV4 } from "sequelize";
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../db/connectpg";
import { Department } from "./departmentModel";
import { School } from "./schoolsModel";

class Faculty extends Model<
  InferAttributes<Faculty>,
  InferCreationAttributes<Faculty>
> {
  declare id: CreationOptional<number>;
  declare facultyName: string;
  declare facultyCode: number;
  declare location: string;
  declare schoolName: ForeignKey<string>;
  associate() {
    Faculty.hasMany(Department, { sourceKey: "facultyCode" });
    Faculty.belongsTo(School, { targetKey: "schoolName" });
  }
}
Faculty.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    facultyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facultyCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false, // Adjust as needed
    },
  },
  { sequelize, modelName: "Faculty" }
);

export { Faculty };
