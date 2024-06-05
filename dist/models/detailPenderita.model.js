"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../utils/config"));
const penderita_model_1 = __importDefault(require("./penderita.model"));
class DetailPenderita extends sequelize_1.Model {
}
DetailPenderita.init({
    detail_penderita_id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    penderita_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: penderita_model_1.default,
            key: 'penderita_id'
        }
    },
    nama: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    alamat_rumah: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tanggal_lahir: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    tableName: 'detail_penderita',
    timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});
exports.default = DetailPenderita;
