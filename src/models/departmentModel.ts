import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connectpg";

export const Department = sequelize.define("Department", {
    departmentName:{
      type: DataTypes.STRING,
      allowNull: false 
    },
    departmentID:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    yearsOfStudy:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    initials:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
    }
  
  })