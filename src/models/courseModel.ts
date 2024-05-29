import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";


interface CourseAttributes{
  courseName:string
  courseCode:string
  creditLoad:number
  semester:string
}

class Course extends Model <CourseAttributes>
implements CourseAttributes{
  courseName!: string;
  courseCode!: string
  creditLoad!:number
  semester!:string 
}
Course.init( {
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseCode: {
      type: DataTypes.STRING,
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
  },{
    sequelize,
    modelName:"Course"
  });

  export {Course}