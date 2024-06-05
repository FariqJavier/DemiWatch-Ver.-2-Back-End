"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../utils/config"));
class Penderita extends sequelize_1.Model {
}
Penderita.init({
    penderita_id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    tableName: 'penderita',
    timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});
exports.default = Penderita;
