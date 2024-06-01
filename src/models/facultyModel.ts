import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../db/connectpg";
import { Department } from "./departmentModel";
interface FacultyAttributes {
  facultyName: string;
  facultyCode: number;
  location: string;
}

class Faculty extends Model<FacultyAttributes> implements FacultyAttributes {
  facultyName!: string;
  facultyCode!: number;
  location!: string;
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
  },
  { sequelize, modelName: "Faculty" }
);

export {Faculty}