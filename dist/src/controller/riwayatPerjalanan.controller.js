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
const logger_1 = __importDefault(require("../utils/logger"));
const uuid_1 = require("uuid");
class RiwayatPerjalananController {
    constructor(penderitaService, hubunganPenderitaService, riwayatPerjalananService) {
        this.penderitaService = penderitaService;
        this.hubunganPenderitaService = hubunganPenderitaService;
        this.riwayatPerjalananService = riwayatPerjalananService;
    } // Receives service as an argument
    createNewRiwayatPerjalanan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    var riwayatUUID = (0, uuid_1.v4)();
                    var lokasiAwalUUID = (0, uuid_1.v4)();
                    var lokasiTerakhirUUID = (0, uuid_1.v4)();
                    var lokasiTujuanUUID = (0, uuid_1.v4)();
                    const { penderita_username, keluarga_username } = req.params;
                    const { alamat_awal, longitude_awal, latitude_awal, longitude_terakhir, latitude_terakhir, alamat_tujuan, longitude_tujuan, latitude_tujuan } = req.body;
                    const hubungan = yield this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username);
                    // Check if the penderita was found
                    if (!hubungan) {
                        throw new Error('Penderita Account has not been connected to Keluarga Account');
                    }
                    const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(penderita_username);
                    // Check if the penderita was found
                    if (!penderita) {
                        throw new Error('Penderita Account not found');
                    }
                    const riwayat = yield this.riwayatPerjalananService.createRiwayatPerjalanan({
                        riwayat_perjalanan_id: riwayatUUID,
                        penderita_id: penderita.penderita_id
                    });
                    logger_1.default.info(`Riwayat Perjalanan created succesfully`);
                    const lokasiAwal = yield this.riwayatPerjalananService.createLokasiAwal({
                        lokasi_awal_id: lokasiAwalUUID,
                        riwayat_perjalanan_id: riwayatUUID,
                        alamat_awal,
                        longitude_awal,
                        latitude_awal
                    });
                    logger_1.default.info(`Lokasi Awal created succesfully`);
                    const lokasiTerakhir = yield this.riwayatPerjalananService.createLokasiTerakhir({
                        lokasi_terakhir_id: lokasiTerakhirUUID,
                        riwayat_perjalanan_id: riwayatUUID,
                        longitude_terakhir,
                        latitude_terakhir
                    });
                    logger_1.default.info(`Lokasi Terakhir created succesfully`);
                    const lokasiTujuan = yield this.riwayatPerjalananService.createLokasiTujuan({
                        lokasi_tujuan_id: lokasiTujuanUUID,
                        riwayat_perjalanan_id: riwayatUUID,
                        alamat_tujuan,
                        longitude_tujuan,
                        latitude_tujuan
                    });
                    logger_1.default.info(`Lokasi Tujuan created succesfully`);
                    res.status(201).json({
                        message: `RIWAYAT PERJALANAN dan DETAIL LOKASI for PENDERITA ${penderita_username} created successfully`,
                        data: {
                            riwayatPerjalanan: riwayat,
                            lokasiAwal: lokasiAwal,
                            lokasiTerakhir: lokasiTerakhir,
                            lokasiTujuan: lokasiTujuan
                        },
                    });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to create RIWAYAT PERJALANAN dan DETAIL LOKASI for PENDERITA: ${error.message}` });
                res.status(500).json({ message: `Failed to create RIWAYAT PERJALANAN dan DETAIL LOKASI for PENDERITA: ${error.message}` });
            }
        });
    }
    getLimaLokasiTerakhirByPenderitaUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { penderita_username } = req.params;
                const lokasi = yield this.riwayatPerjalananService.getLimaLokasiTerakhirByPenderitaUsername(penderita_username);
                logger_1.default.info(`Lima LOKASI TERAKHIR PENDERITA ${penderita_username} has been found`);
                res.status(200).json({
                    message: `Lima LOKASI TERAKHIR PENDERITA ${penderita_username} has been found`,
                    data: lokasi,
                });
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to get Lima LOKASI TERAKHIR PENDERITA: ${error.message}` });
                res.status(500).json({ message: `Failed to get Lima LOKASI TERAKHIR PENDERITA: ${error.message}` });
            }
        });
    }
    getAllRiwayatPerjalananByPenderitaUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { penderita_username, keluarga_username } = req.params;
                const hubungan = yield this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username);
                // Check if the penderita was found
                if (!hubungan) {
                    throw new Error('Penderita Account has not been connected to Keluarga Account');
                }
                const riwayat = yield this.riwayatPerjalananService.getKelompokLokasiByEveryRiwayatPerjalananPenderita(penderita_username);
                logger_1.default.info(`All RIWAYAT PERJALANAN PENDERITA: ${penderita_username} has been found`);
                res.status(200).json({
                    message: `All RIWAYAT PERJALANAN PENDERITA: ${penderita_username} has been found`,
                    data: riwayat,
                });
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to get All RIWAYAT PERJALANAN PENDERITA: ${error.message}` });
                res.status(500).json({ message: `Failed to get All RIWAYAT PERJALANAN PENDERITA: ${error.message}` });
            }
        });
    }
    getSpecificRiwayatPerjalananPenderita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { penderita_username, keluarga_username, riwayat_perjalanan_id } = req.params;
                const hubungan = yield this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username);
                // Check if the penderita was found
                if (!hubungan) {
                    throw new Error('Penderita Account has not been connected to Keluarga Account');
                }
                const riwayat = yield this.riwayatPerjalananService.getKelompokLokasiBySpecificRiwayatPerjalananPenderita(penderita_username, riwayat_perjalanan_id);
                logger_1.default.info(`RIWAYAT PERJALANAN ID: ${riwayat_perjalanan_id} for PENDERITA: ${penderita_username} has been found`);
                res.status(200).json({
                    message: `RIWAYAT PERJALANAN ID: ${riwayat_perjalanan_id} for PENDERITA: ${penderita_username} has been found`,
                    data: riwayat,
                });
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to get Specific RIWAYAT PERJALANAN PENDERITA: ${error.message}` });
                res.status(500).json({ message: `Failed to get Specific RIWAYAT PERJALANAN PENDERITA: ${error.message}` });
            }
        });
    }
    updateLokasiTerakhirByRiwayatPerjalanan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lokasiTerakhirUUID = (0, uuid_1.v4)();
                const { penderita_username, riwayat_perjalanan_id } = req.params;
                const { longitude_terakhir, latitude_terakhir } = req.body;
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(penderita_username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                const lokasi = yield this.riwayatPerjalananService.createLokasiTerakhir({
                    lokasi_terakhir_id: lokasiTerakhirUUID,
                    riwayat_perjalanan_id,
                    longitude_terakhir,
                    latitude_terakhir
                });
                logger_1.default.info(`New Lokasi Terakhir updated succesfully`);
                res.status(200).json({
                    message: `New LOKASI TERAKHIR for RIWAYAT PERJALANAN PENDERITA ${penderita_username} updated successfully`,
                    data: lokasi,
                });
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to update New LOKASI TERAKHIR for RIWAYAT PERJALANAN PENDERITA ${error.message}` });
                res.status(500).json({ message: `Failed to update New LOKASI TERAKHIR for RIWAYAT PERJALANAN PENDERITA: ${error.message}` });
            }
        });
    }
}
exports.default = RiwayatPerjalananController;
