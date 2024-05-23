import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connectpg";


export const User = sequelize.define("User",{
    id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    firstName:{
      type:DataTypes.STRING,
      allowNull:false
    },
    lastName:{
      type:DataTypes.STRING,
      allowNull:false
    },
    middleName:{
      type:DataTypes.STRING,
      allowNull:true
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    role:{
      type:DataTypes.ENUM,
      values:["student", "lecturer", "staff"],
      default:"student",
      allowNull:false
    },
  })