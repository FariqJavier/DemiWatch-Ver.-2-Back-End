"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../utils/config"));
const riwayatPerjalanan_model_1 = __importDefault(require("./riwayatPerjalanan.model"));
class LokasiTerakhir extends sequelize_1.Model {
}
LokasiTerakhir.init({
    lokasi_terakhir_id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    riwayat_perjalanan_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: riwayatPerjalanan_model_1.default,
            key: 'riwayat_perjalanan_id'
        }
    },
    longitude_terakhir: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    latitude_terakhir: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    timestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: config_1.default,
    tableName: 'lokasi_terakhir',
    timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});
exports.default = LokasiTerakhir;
