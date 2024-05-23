// import { Model, Optional } from "sequelize";
// import * as dotenv from "dotenv";
// import { connection } from "./db/connectpg";
// dotenv.config();

// interface Productattriutes {
//   id: number;
//   name: string;
//   price: number;
// }

// type ProductCreationAttributes = Optional<Productattriutes, "id">;

// export class Product extends Model<
//   Productattriutes,
//   ProductCreationAttributes
// > {
//   declare id: number;
//   declare name: string;
//   declare price: number;
// }

// // queryInterface.createTable('Person', {
// //     name: DataTypes.STRING,
// //     isBetaMember: {
// //       type: DataTypes.BOOLEAN,
// //       defaultValue: false,
// //       allowNull: false
// //     }
// //   });

// // const createTableQuery = `CREATE TABLE IF NOT EXISTS products (
// //     id SERIAL PRIMARY KEY,
// //     name VARCHAR(255) NOT NULL,
// //     price DECIMAL(10, 2) NOT NULL
// // );`;

// // try {
// //     await client.query(createTableQuery);
// //     console.log('Table "products" created successfully!');
// // } catch (error) {
// //     console.error('Error creating table:', error);
// // }
