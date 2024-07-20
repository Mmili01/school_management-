// import { Sequelize, DataTypes, Model, Optional} from "sequelize";
// import { sequelize } from "../db/connectpg";
// import { generateGmailExtension } from "../utils/schoolgmail";
// import * as bcrypt from "bcryptjs";
// import { Faculty } from "./facultyModel";

// interface SchoolAttributes{
//    id: any;
//    schoolName: string;
//    password: string;
//    location: string;
//    schoolType: "Federal" | "State" | "Private";
//    schoolImage?: string;
//    schoolID: number;
//    emailExtension: string;
//    faculties:string
// }
// interface SchoolCreationAttributes extends Optional <SchoolAttributes, "emailExtension">{}
// class School extends Model<SchoolAttributes, SchoolCreationAttributes> 
// implements SchoolAttributes{
//   id: number | null | undefined;
//   schoolName!: string;
//   password!: string;
//   location!: string;
//   schoolType!: "Federal" | "State" | "Private";
//   schoolImage?: string;
//   schoolID!: number;
//   emailExtension!: string;
//   faculties!:string
//   public validPassword(password: string): boolean {
//     return bcrypt.compareSync(password, this.password);
//   }

//   static associate(model:any){
//     School.hasMany(model.Faculty, {foreignKey:"schoolName"} )
//     School.hasMany(model.User, {foreignKey:"schoolName"})
//   }
// }

// School.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     schoolName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     location: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     schoolType: {
//       type: DataTypes.ENUM,
//       values: ["Fedral", "State", "Private"],
//       allowNull: true,
//     },
//     schoolImage: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     schoolID: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     emailExtension: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     faculties:{
//       type:DataTypes.STRING,
//       allowNull:false,
//       references:{
//         model:Faculty,
//         key:"f"
//       }
//     }
//   },
//   {
//     sequelize,
//     modelName: "School",
//     hooks: {
//       beforeCreate: async (school: School) => {
//         school.emailExtension = generateGmailExtension(school.schoolName);
//         const salt = await bcrypt.genSalt(10);
//         school.password = await bcrypt.hash(school.password, salt);
//       },
//     },
//   }
// );

// School.prototype.validPassword = function(password:string){
//   return bcrypt.compareSync(password, this.password)
// }

// export { School };

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/connectpg";
import { generateGmailExtension } from "../utils/schoolgmail";
import * as bcrypt from "bcryptjs";


interface SchoolAttributes {
  id: number;
  schoolName: string;
  password: string;
  location?: string; // nullable location
  schoolType: "Federal" | "State" | "Private";
  schoolImage?: string; // nullable schoolImage
  schoolID: number;
  emailExtension: string;
  // Remove faculties as a property
}

interface SchoolCreationAttributes extends Optional<SchoolAttributes, "id"> {}

class School extends Model<SchoolAttributes, SchoolCreationAttributes> implements SchoolAttributes {
  id!: number
  schoolName!: string;
  password!: string;
  location?: string;
  schoolType!: "Federal" | "State" | "Private";
  schoolImage?: string;
  schoolID!: number;
  emailExtension!: string;

  public validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  static associate(models: any) {
    School.hasMany(models.Faculty, { foreignKey: "schoolId" }); // Assuming foreign key in Faculty is schoolId
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
