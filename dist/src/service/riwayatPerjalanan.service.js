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
const lokasiAwal_model_1 = __importDefault(require("../models/lokasiAwal.model"));
const lokasiTerakhir_model_1 = __importDefault(require("../models/lokasiTerakhir.model"));
const lokasiTujuan_model_1 = __importDefault(require("../models/lokasiTujuan.model"));
const riwayatPerjalanan_model_1 = __importDefault(require("../models/riwayatPerjalanan.model"));
class RiwayatPerjalananService {
    constructor(penderitaService) {
        this.penderitaService = penderitaService;
    } // Receives service as an argument
    createRiwayatPerjalanan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const riwayat = yield riwayatPerjalanan_model_1.default.create(data);
                return riwayat;
            }
            catch (error) {
                throw new Error(`Failed to create Riwayat Perjalanan: ${error}`);
            }
        });
    }
    createLokasiAwal(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const riwayat = yield lokasiAwal_model_1.default.create(data);
                return riwayat;
            }
            catch (error) {
                throw new Error(`Failed to create Lokasi Awal: ${error}`);
            }
        });
    }
    createLokasiTerakhir(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lokasi = yield lokasiTerakhir_model_1.default.create(data);
                return lokasi;
            }
            catch (error) {
                throw new Error(`Failed to create Lokasi Terakhir: ${error}`);
            }
        });
    }
    createLokasiTujuan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const riwayat = yield lokasiTujuan_model_1.default.create(data);
                return riwayat;
            }
            catch (error) {
                throw new Error(`Failed to create Lokasi Tujuan: ${error}`);
            }
        });
    }
    getLokasiTerakhirByRiwayatperjalananId(id, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lokasi = yield lokasiTerakhir_model_1.default.findAll({
                    where: { riwayat_perjalanan_id: id },
                    order: [['timestamp', 'DESC']],
                    limit: limit,
                });
                return lokasi;
            }
            catch (error) {
                throw new Error(`Failed to get Lokasi Terakhir Penderita ID: ${error}`);
            }
        });
    }
    getAllLokasiAwalByRiwayatPerjalananId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lokasi = yield lokasiAwal_model_1.default.findAll({
                    where: { riwayat_perjalanan_id: id },
                    order: [
                        ['longitude_awal', 'DESC'],
                        ['latitude_awal', 'DESC']
                    ],
                });
                return lokasi;
            }
            catch (error) {
                throw new Error(`Failed to get All Lokasi Awal By Riwayat Perjalanan Id: ${error}`);
            }
        });
    }
    getAllLokasiTujuanByRiwayatPerjalananId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lokasi = yield lokasiTujuan_model_1.default.findAll({
                    where: { riwayat_perjalanan_id: id },
                    order: [
                        ['longitude_tujuan', 'DESC'],
                        ['latitude_tujuan', 'DESC']
                    ],
                });
                return lokasi;
            }
            catch (error) {
                throw new Error(`Failed to get All Lokasi Tujuan By Riwayat Perjalanan Id: ${error}`);
            }
        });
    }
    getLimaLokasiTerakhirByPenderitaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                const riwayat = yield riwayatPerjalanan_model_1.default.findOne({
                    where: { penderita_id: penderita.penderita_id },
                    order: [['created_at', 'DESC']],
                });
                // Check if the latest riwayat was found
                if (!riwayat) {
                    throw new Error('Riwayat Perjalanan not found');
                }
                const lokasi = yield this.getLokasiTerakhirByRiwayatperjalananId(riwayat.riwayat_perjalanan_id, 5);
                return lokasi;
            }
            catch (error) {
                throw new Error(`Failed to Five Lokasi Terakhir Penderita By Penderita Username: ${error}`);
            }
        });
    }
    getAllRiwayatPerjalananByPenderitaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                const riwayat = yield riwayatPerjalanan_model_1.default.findAll({
                    where: { penderita_id: penderita.penderita_id }
                });
                return riwayat;
            }
            catch (error) {
                throw new Error(`Failed to get All Riwayat Perjalanan by Penderita Username: ${error}`);
            }
        });
    }
    getRiwayatPerjalananByRiwayatPerjalananId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const riwayat = yield riwayatPerjalanan_model_1.default.findOne({
                    where: { riwayat_perjalanan_id: id }
                });
                return riwayat;
            }
            catch (error) {
                throw new Error(`Failed to get Riwayat Perjalanan by Riwayat Perjalanan Id: ${error}`);
            }
        });
    }
    getKelompokLokasiByEveryRiwayatPerjalananPenderita(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const riwayatPerjalanan = yield this.getAllRiwayatPerjalananByPenderitaUsername(username);
                if (!riwayatPerjalanan) {
                    throw new Error('Riwayat Perjalanan not found');
                }
                const groupedLokasi = yield Promise.all(riwayatPerjalanan.map((riwayat) => __awaiter(this, void 0, void 0, function* () {
                    const lokasiAwal = yield this.getAllLokasiAwalByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id);
                    const lokasiTujuan = yield this.getAllLokasiTujuanByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id);
                    return {
                        riwayatPerjalanan: riwayat,
                        lokasiAwal: lokasiAwal,
                        lokasiTujuan: lokasiTujuan,
                    };
                })));
                return groupedLokasi;
            }
            catch (error) {
                throw new Error(`Failed to get Pengelompokan Lokasi by Every Riwayat Perjalanan Penderita: ${error}`);
            }
        });
    }
    getKelompokLokasiBySpecificRiwayatPerjalananPenderita(username, riwayat_perjalanan_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                const riwayatPerjalanan = yield this.getRiwayatPerjalananByRiwayatPerjalananId(riwayat_perjalanan_id);
                if (!riwayatPerjalanan) {
                    throw new Error('Riwayat Perjalanan not found');
                }
                if (riwayatPerjalanan.penderita_id != penderita.penderita_id) {
                    throw new Error('Riwayat Perjalanan is not from Current Penderita');
                }
                const lokasiAwal = yield this.getAllLokasiAwalByRiwayatPerjalananId(riwayat_perjalanan_id);
                const lokasiTujuan = yield this.getAllLokasiTujuanByRiwayatPerjalananId(riwayat_perjalanan_id);
                return {
                    lokasiAwal,
                    lokasiTujuan
                };
            }
            catch (error) {
                throw new Error(`Failed to get Pengelompokan Lokasi by Every Riwayat Perjalanan Penderita: ${error}`);
            }
        });
    }
    updateLokasiTujuanByLokasiTujuanId(username, riwayat_perjalanan_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(username);
                if (!penderita) {
                    throw new Error('Penderita not found');
                }
                const riwayatPerjalanan = yield this.getRiwayatPerjalananByRiwayatPerjalananId(riwayat_perjalanan_id);
                if (!riwayatPerjalanan) {
                    throw new Error('Riwayat Perjalanan not found');
                }
                const [updatedRows, updatedLokasi] = yield lokasiTujuan_model_1.default.update(data, {
                    where: {
                        riwayat_perjalanan_id: riwayat_perjalanan_id
                    },
                    returning: true,
                });
                return [updatedRows, updatedLokasi];
            }
            catch (error) {
                throw new Error(`Failed to update Lokasi Tujuan: ${error}`);
            }
        });
    }
}
exports.default = RiwayatPerjalananService;
