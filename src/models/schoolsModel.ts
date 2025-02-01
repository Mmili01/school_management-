import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/connectpg";
import { generateGmailExtension } from "../utils/schoolgmail";
import * as bcrypt from "bcryptjs";
import { User } from "./userModel";
import { Faculty } from "./facultyModel";

interface SchoolAttributes {
  id: number;
  schoolName: string;
  password: string;
  location?: string; 
  schoolType: "Federal" | "State" | "Private";
  schoolImage?: string; 
  schoolID: number;
  emailExtension: string;
}

interface SchoolCreationAttributes extends Optional<SchoolAttributes, "id"> {}

class School
  extends Model<SchoolAttributes, SchoolCreationAttributes>
  implements SchoolAttributes
{
  declare id: number;
  declare schoolName: string;
  declare password: string;
  declare location?: string;
  declare schoolType: "Federal" | "State" | "Private";
  declare schoolImage?: string;
  declare schoolID: number;
  declare emailExtension: string;

  public validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  associate() {
    School.hasMany(Faculty, { sourceKey: "schoolId" });
    School.hasMany(User, { sourceKey: "schoolName" });
  }
}

School.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schoolType: {
      type: DataTypes.ENUM,
      values: ["Federal", "State", "Private"],
      allowNull: true,
    },
    schoolImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schoolID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emailExtension: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "School",
    hooks: {
      beforeCreate: async (school: School) => {
        school.emailExtension = generateGmailExtension(school.schoolName);
        const salt = await bcrypt.genSalt(10);
        school.password = await bcrypt.hash(school.password, salt);
      },
    },
  }
);

export { School };
