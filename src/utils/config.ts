import { Sequelize } from 'sequelize';
import logger from "./logger";
import mysql2 from 'mysql2'; 

const sequelize = new Sequelize('demiwatch', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: (sql, timing) => {
    // Your custom logging logic here
    logger.warn(sql); // Log the generated SQL query
    logger.warn(`Query took ${timing}ms`); // Log the query execution time (optional)
  },
});

export default sequelize;