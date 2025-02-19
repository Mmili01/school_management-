import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "../db/connectpg";

class Information extends Model<
  InferAttributes<Information>,
  InferCreationAttributes<Information>
> {
  declare id: CreationOptional<string>;
  declare headline: string;
  declare body: string;
  declare postDate: Date;
}

Information.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    headline: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    body: { type: DataTypes.TEXT, allowNull: false },
    postDate: { type: DataTypes.DATE, allowNull: false},
  },
  { sequelize, modelName: "Information" }
);

export { Information };
