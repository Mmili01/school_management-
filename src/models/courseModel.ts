import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/connectpg";

class Course extends Model<
  InferAttributes<Course>,
  InferCreationAttributes<Course>
> {
  declare id: CreationOptional<number>;
  declare courseName: string;
  declare courseCode: string;
  declare creditLoad: number;
  declare semester: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Course.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    courseName: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    courseCode: {
      type: new DataTypes.STRING(),
      allowNull: false,
      unique: true,
    },
    creditLoad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM,
      values: ["first", "second"],
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "Course",
  }
);

export { Course };
