import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";
import { generateGmailExtension } from "../utils/schoolgmail";
import * as bcrypt from "bcryptjs";
import { Faculty } from "./facultyModel";

interface SchoolAttributes{
   id: any;
   schoolName: string;
   password: string;
   location: string;
   schoolType: "Federal" | "State" | "Private";
   schoolImage?: string;
   schoolID: number;
   emailExtension: string;
   faculties:string
}
class School extends Model<SchoolAttributes> 
implements SchoolAttributes{
  id: number | null | undefined;
  schoolName!: string;
  password!: string;
  location!: string;
  declare schoolType: "Federal" | "State" | "Private";
  schoolImage?: string;
  schoolID!: number;
  emailExtension!: string;
  faculties!:string
  public validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  static associate(model:any){
    School.hasMany(model.Faculty, {foreignKey:"schoolName"} )
    School.hasMany(model.User, {foreignKey:"schoolName"})
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
    emailExtension: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    faculties:{
      type:DataTypes.ARRAY,
      allowNull:false,
      references:{
        model:Faculty,
        key:"f"
      }
    }
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

School.prototype.validPassword = function(password:string){
  return bcrypt.compareSync(password, this.password)
}

export { School };
