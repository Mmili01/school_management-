import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/connectpg";
interface UserAttributes {
   id: number;
   firstName: string;
   lastName: string;
   surname: string;
  //  email: string;
   password: string;
   userType: string;
}
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}
class User extends Model<UserAttributes, UserCreationAttributes> 
implements UserAttributes{
   id!: number;
   firstName!: string;
   lastName!: string;
  surname!: string;
  //  email!: string;
   password!: string;
   userType!: string;

   static associate(models: any){
    User.hasMany(models.Student, {foreignKey:"userId"})
   }
}
// user model 
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM,
      values: ["student", "lecturer", "staff"],
      defaultValue: "student",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export { User };
