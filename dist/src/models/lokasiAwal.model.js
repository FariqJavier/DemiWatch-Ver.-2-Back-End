"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../utils/config"));
const riwayatPerjalanan_model_1 = __importDefault(require("./riwayatPerjalanan.model"));
class LokasiAwal extends sequelize_1.Model {
}
LokasiAwal.init({
    lokasi_awal_id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    riwayat_perjalanan_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: {
            model: riwayatPerjalanan_model_1.default,
            key: 'riwayat_perjalanan_id'
        }
    },
    alamat_awal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    longitude_awal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    latitude_awal: {
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
    tableName: 'lokasi_awal',
    timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});
exports.default = LokasiAwal;
