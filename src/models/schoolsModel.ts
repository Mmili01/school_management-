import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";
import { generateGmailExtension } from "../utils/schoolgmail";
import * as bcrypt from "bcryptjs";

class School extends Model {
  public id!: number;
  public schoolName!: string;
  public password!: string;
  public location?: string;
  public schoolType?: "Federal" | "State" | "Private";
  public schoolImage?: string;
  public schoolID!: number;
  public gmailExtension!: string;
  public validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}

School.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      values: ["Fedral", "State", "Private"],
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
    gmailExtension: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "School",
    hooks: {
      beforeCreate: async (school: School) => {
        school.gmailExtension = generateGmailExtension(school.schoolName);
        const salt = await bcrypt.genSalt(10);
        school.password = await bcrypt.hash(school.password, salt);
      },
    },
  }
);

School.prototype.validPassword = function(password:string){
  return bcrypt.compareSync(password, this.password)
}

export { School };
