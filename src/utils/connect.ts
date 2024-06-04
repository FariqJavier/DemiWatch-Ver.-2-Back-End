import logger from "./logger";
import sequelize from '../utils/config';

async function connect() {
  // Sync all models with database
  sequelize.sync({ force: false }) // Set force: true to drop existing tables and re-create them
    .then(() => {
      logger.info('All models were synchronized successfully.');
    })
    .catch((err) => {
      logger.error('An error occurred while synchronizing the models:', err);
    });

  // Check the connection
  sequelize.authenticate()
    .then(() => {
      // logger.info(`Check sequelize connection: ${JSON.stringify(sequelize.config)}`);
      logger.info(`Check sequelize connection: DATABASE CONNECTED`);
    })
    .catch((error) => {
      logger.error(`Error connecting to database: ${error}`);
    });
}

export default connect;
