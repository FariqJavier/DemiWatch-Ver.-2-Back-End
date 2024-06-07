import { Sequelize } from 'sequelize';
import logger from "./logger";
import mysql2 from 'mysql2'; 

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 3306,
  dialectModule: mysql2,
  logging: (sql, timing) => {
    // Your custom logging logic here
    logger.warn(sql); // Log the generated SQL query
    logger.warn(`Query took ${timing}ms`); // Log the query execution time (optional)
  },
});

export default sequelize;