"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("../utils/config"));
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        // Sync all models with database
        config_1.default.sync({ force: false }) // Set force: true to drop existing tables and re-create them
            .then(() => {
            logger_1.default.info('All models were synchronized successfully.');
        })
            .catch((err) => {
            logger_1.default.error('An error occurred while synchronizing the models:', err);
        });
        // Check the connection
        config_1.default.authenticate()
            .then(() => {
            // logger.info(`Check sequelize connection: ${JSON.stringify(sequelize.config)}`);
            logger_1.default.info(`Check sequelize connection: DATABASE CONNECTED`);
        })
            .catch((error) => {
            logger_1.default.error(`Error connecting to database: ${error}`);
        });
    });
}
exports.default = connect;
