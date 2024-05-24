import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";

class User extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public middleName?: string;
  public email!: string;
  public password!: string;
  public role!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
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
