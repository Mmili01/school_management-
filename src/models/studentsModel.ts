import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connectpg";

export const student= sequelize.define("Student",{
    regNumber:{
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true
    },
    CGPA:{
      type:DataTypes.FLOAT,
      defaultValue:5.0
    },
    Assignments:{
      type:DataTypes.STRING
    },
    level:{
      type:DataTypes.INTEGER
    }
  })
  