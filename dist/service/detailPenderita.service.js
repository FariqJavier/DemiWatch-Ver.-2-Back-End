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
const sequelize_1 = require("sequelize");
const detailPenderita_model_1 = __importDefault(require("../models/detailPenderita.model"));
class DetailPenderitaService {
    constructor(penderitaService) {
        this.penderitaService = penderitaService;
    } // Receives service as an argument
    createDetailPenderita(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detailPenderita = yield detailPenderita_model_1.default.create(data);
                return detailPenderita;
            }
            catch (error) {
                throw new Error(`Failed to create Detail Penderita: ${error}`);
            }
        });
    }
    getDetailPenderitaByPenderitaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                const detailPenderita = yield detailPenderita_model_1.default.findOne({
                    where: { penderita_id: penderita.penderita_id }
                });
                return detailPenderita;
            }
            catch (error) {
                throw new Error(`Failed to get Detail Penderita by Penderita Username Account: ${error}`);
            }
        });
    }
    getDetailPenderitaByPenderitaId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detailPenderita = yield detailPenderita_model_1.default.findByPk(id);
                return detailPenderita;
            }
            catch (error) {
                throw new Error(`Failed to get Detail Penderita by Penderita Username Account: ${error}`);
            }
        });
    }
    getDetailPenderitaByImperfectDetailPenderitaData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield detailPenderita_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('LOWER', sequelize_1.Sequelize.fn('REPLACE', sequelize_1.Sequelize.col('nama'), ' ', '')), 
                            // Sequelize.fn('LOWER', Sequelize.col('nama')),
                            {
                                [sequelize_1.Op.like]: `%${data.nama.toLowerCase().replace(/\s/g, '')}%`
                            }),
                            sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('LOWER', sequelize_1.Sequelize.fn('REPLACE', sequelize_1.Sequelize.col('alamat_rumah'), ' ', '')), 
                            // Sequelize.fn('LOWER', Sequelize.col('alamat_rumah')),
                            {
                                [sequelize_1.Op.like]: `%${data.alamat_rumah.toLowerCase().replace(/\s/g, '')}%`
                            }),
                            {
                                tanggal_lahir: {
                                    [sequelize_1.Op.gte]: new Date(data.tanggal_lahir.getFullYear(), data.tanggal_lahir.getMonth(), data.tanggal_lahir.getDate())
                                },
                                gender: data.gender
                            }
                        ]
                    }
                });
                // const penderita = await DetailPenderita.findOne({
                //   where: {
                //     nama: {
                //       [Op.like]: `%${data.nama}%`
                //     },
                //     alamat_rumah: {
                //       [Op.like]: `%${data.alamat_rumah}%`
                //     },
                //     tanggal_lahir: {
                //       [Op.gte]: new Date(data.tanggal_lahir.getFullYear(), data.tanggal_lahir.getMonth(), data.tanggal_lahir.getDate())
                //     },
                //     gender: data.gender
                //   }
                // });
                return penderita;
            }
            catch (error) {
                throw new Error(`Failed to get Detail Penderita: ${error}`);
            }
        });
    }
    updateDetailPenderitaByPenderitaUsername(username, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                // Filter out null properties
                const filteredData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null));
                const [updatedRows, updatedDetailPenderita] = yield detailPenderita_model_1.default.update(filteredData, {
                    where: { penderita_id: penderita.penderita_id },
                    returning: true,
                });
                return [updatedRows, updatedDetailPenderita];
            }
            catch (error) {
                throw new Error(`Failed to update Detail Penderita by Penderita Username Account: ${error}`);
            }
        });
    }
    deletePenderitaAccountByPenderitaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                const deleteDetailPenderitaRows = yield detailPenderita_model_1.default.destroy({
                    where: { penderita_id: penderita.penderita_id }
                });
                const deletePenderitaRows = yield this.penderitaService.deletePenderitaByPenderitaUsername(username);
                return deleteDetailPenderitaRows;
            }
            catch (error) {
                throw new Error(`Failed to delete Detail Penderita and Penderita account by Penderita Username Account: ${error}`);
            }
        });
    }
}
exports.default = DetailPenderitaService;
