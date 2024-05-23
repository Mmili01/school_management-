import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connectpg";

export const lecturer = sequelize.define("Lecturer", {

    level:{
      type:DataTypes.STRING
    },
    Position:{
      type:DataTypes.STRING
    }, 
    lecturerId:{
        type:DataTypes.STRING,
        unique: true,
        allowNull:false
    }
  })