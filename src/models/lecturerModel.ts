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
import { User } from "./userModel";

class Lecturer extends Model<
  InferAttributes<Lecturer>,
  InferCreationAttributes<Lecturer>
> {
  declare id: CreationOptional<number>;
  declare level: string;
  declare position: string;
  declare lecturerId: string;
  declare userId: ForeignKey<number>;
  declare departmentId: ForeignKey<number>;
  declare lecturerEmail: string;

  associate() {
    Lecturer.belongsTo(User, { targetKey: "userId" });
    Lecturer.belongsTo(Department, { targetKey: "departmentId" });
  }
}
Lecturer.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    modelName: "Lecturer",
  }
);

export { Lecturer };
