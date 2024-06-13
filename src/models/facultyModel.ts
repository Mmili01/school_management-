import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/connectpg";
import { Department } from "./departmentModel";
import { School } from "./schoolsModel";
interface FacultyAttributes {
  facultyName: string;
  facultyCode: number;
  location: string;
  schoolName: string
}
interface FacultyCreationAttributes extends Optional <FacultyAttributes, "schoolName">{}
class Faculty extends Model<FacultyAttributes, FacultyCreationAttributes> implements FacultyAttributes {
  facultyName!: string;
  facultyCode!: number;
  location!: string;
  schoolName!: string
  static associate(model:any){
    Faculty.hasMany(model.Department, {foreignKey:'facultyCode'})
  }

}
Faculty.init(
  {
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
    schoolName:{
      type: DataTypes.STRING,
      allowNull:false,
      references:{
        model:School,
        key:"schoolName"
      }
    }

  },
  { sequelize, modelName: "Faculty" }
);

export {Faculty}