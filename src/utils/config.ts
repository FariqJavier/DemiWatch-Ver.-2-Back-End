import { Sequelize } from 'sequelize';
import logger from "./logger";

const sequelize = new Sequelize('demiwatch', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  logging: (sql, timing) => {
    // Your custom logging logic here
    logger.warn(sql); // Log the generated SQL query
    logger.warn(`Query took ${timing}ms`); // Log the query execution time (optional)
  },
});

export default sequelize;