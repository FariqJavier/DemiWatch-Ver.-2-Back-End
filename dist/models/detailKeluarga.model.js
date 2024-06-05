"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../utils/config"));
const keluarga_model_1 = __importDefault(require("./keluarga.model"));
class DetailKeluarga extends sequelize_1.Model {
}
DetailKeluarga.init({
    detail_keluarga_id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    keluarga_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: keluarga_model_1.default,
            key: 'keluarga_id'
        }
    },
    nama: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nomor_hp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: config_1.default,
    tableName: 'detail_keluarga',
    timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});
exports.default = DetailKeluarga;
