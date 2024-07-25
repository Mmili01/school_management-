import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/connectpg";
import { Lecturer, School, Student } from "./mergerModel";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare surname: string;
  declare email: string;
  declare password: string;
  declare userType: string;
  declare schoolName: ForeignKey<string>;

  associate() {
    User.belongsTo(School, { targetKey: "schoolName" });
    User.hasMany(Student, { sourceKey: "userId" });
    User.hasMany(Lecturer, { sourceKey: "userId" });
  }
}
// user model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM,
      values: ["student", "lecturer", "staff"],
      defaultValue: "student",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export { User };
