"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("./logger"));
const mysql2_1 = __importDefault(require("mysql2"));
const sequelize = new sequelize_1.Sequelize('demiwatch', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2_1.default,
    logging: (sql, timing) => {
        // Your custom logging logic here
        logger_1.default.warn(sql); // Log the generated SQL query
        logger_1.default.warn(`Query took ${timing}ms`); // Log the query execution time (optional)
    },
});
exports.default = sequelize;
