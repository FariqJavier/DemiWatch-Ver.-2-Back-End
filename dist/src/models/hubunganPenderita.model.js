"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../utils/config"));
const penderita_model_1 = __importDefault(require("./penderita.model"));
const keluarga_model_1 = __importDefault(require("./keluarga.model"));
class HubungaPenderita extends sequelize_1.Model {
}
HubungaPenderita.init({
    penderita_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: penderita_model_1.default,
            key: 'penderita_id'
        }
    },
    keluarga_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: keluarga_model_1.default,
            key: 'keluarga_id'
        }
    },
}, {
    sequelize: config_1.default,
    tableName: 'hubungan_penderita',
    timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});
exports.default = HubungaPenderita;
