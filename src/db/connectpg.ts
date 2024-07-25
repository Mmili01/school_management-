const { Sequelize } = require("sequelize");
import * as dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URI, {
  dialect: "postgres",
  logging: false,
}); // Example for postgres

export const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: true });
    console.log("Database synchronized");
    console.log("Database synced.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  // sequelize.close();
};
