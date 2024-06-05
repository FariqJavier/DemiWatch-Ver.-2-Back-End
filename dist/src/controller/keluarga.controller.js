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
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = __importDefault(require("../utils/logger"));
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10; // Adjust as needed (higher = slower, more secure)
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        return yield bcrypt_1.default.hash(password, salt);
    });
}
class KeluargaController {
    constructor(keluargaService, detailKeluargaService, penderitaService, hubunganPenderitaService, authService) {
        this.keluargaService = keluargaService;
        this.detailKeluargaService = detailKeluargaService;
        this.penderitaService = penderitaService;
        this.hubunganPenderitaService = hubunganPenderitaService;
        this.authService = authService;
    } // Receives service as an argument
    // Unauthorized Endpoint
    registerKeluargaAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluargaUUID = (0, uuid_1.v4)();
                const detailKeluargaUUID = (0, uuid_1.v4)();
                const { username, password, nama, nomor_hp } = req.body;
                const hashed_password = yield hashPassword(password);
                const keluarga = yield this.keluargaService.createKeluarga({
                    keluarga_id: keluargaUUID,
                    username,
                    password: hashed_password,
                });
                logger_1.default.info(`KELUARGA created succesfully`);
                const detailKeluarga = yield this.detailKeluargaService.createDetailKeluarga({
                    detail_keluarga_id: detailKeluargaUUID,
                    keluarga_id: keluargaUUID,
                    nama,
                    nomor_hp,
                });
                logger_1.default.info(`DETAIL KELUARGA created succesfully`);
                res.status(201).json({
                    message: 'KELUARGA ACCOUNT created successfully',
                    data: {
                        keluarga: keluarga,
                        detailKeluarga: detailKeluarga
                    }
                });
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to create KELUARGA ACCOUNT: ${error.message}` });
                res.status(500).json({ message: `Failed to create KELUARGA ACCOUNT: ${error.message}` });
            }
        });
    }
    // Unauthorized Endpoint
    loginKeluargaAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const keluarga = yield this.authService.validateKeluargaAccount(username, password);
                if (keluarga) {
                    logger_1.default.info(`KELUARGA: ${username} has been authenticated`);
                    res.status(200).json({
                        message: `KELUARGA: ${username} has been authenticated`,
                        data: {
                            keluarga_id: keluarga.id,
                            username: keluarga.username,
                            accessToken: keluarga.accessToken,
                            refreshToken: keluarga.refreshToken,
                        }, // Bisa berisi token atau informasi user lainnya
                    });
                }
                else {
                    logger_1.default.error({ message: 'Invalid username or password' });
                    res.status(401).json({ message: 'Invalid username or password' });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to login KELUARGA ACCOUNT: ${error.message}` });
                res.status(500).json({ message: `Failed to login KELUARGA ACCOUNT: ${error.message}` });
            }
        });
    }
    // Unauthorized Endpoint
    getKeluargaProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                const detailKeluarga = yield this.detailKeluargaService.getDetailKeluargaByKeluargaUsername(username);
                if (!detailKeluarga) {
                    logger_1.default.error({ message: 'KELUARGA Account not found' });
                    res.status(404).json({ message: 'KELUARGA Account not found' });
                    return;
                }
                logger_1.default.info(`KELUARGA Account has been found`);
                const detailPenderita = yield this.hubunganPenderitaService.getDetailPenderitaByKeluargaUsername(username);
                if (!detailPenderita) {
                    logger_1.default.error({ message: 'PENDERITA Account not found' });
                    res.status(404).json({ message: 'PENDERITA Account not found' });
                    return;
                }
                logger_1.default.info(`PENDERITA Account linked to KELUARGA Account has been found`);
                res.status(201).json({
                    message: 'DETAIL PENDERITA AND DETAIL KELUARGA linked to KELUARGA Account has been found',
                    data: {
                        detailKeluarga: detailKeluarga,
                        detailPenderita: detailPenderita,
                    }
                });
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to get KELUARGA ACCOUNT: ${error.message}` });
                res.status(500).json({ message: `Failed to get KELUARGA ACCOUNT: ${error.message}` });
            }
        });
    }
    // AUTHORIZED ENDPOINT
    createPenderitaConnectionByPenderitaUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { username } = req.params;
                    const { penderita_username } = req.body;
                    const hubungan = yield this.hubunganPenderitaService.createHubunganPenderitaByPenderitaData(username, {
                        penderita_username
                    });
                    if (!hubungan) {
                        logger_1.default.error({ message: 'Cannot Create Connection to PENDERITA Account' });
                        res.status(404).json({ message: 'Cannot Create Connection to PENDERITA Account' });
                        return;
                    }
                    logger_1.default.info(` PENDERITA Account: ${penderita_username} has been linked to KELUARGA Account: ${username}`);
                    res.status(200).json({
                        message: `PENDERITA Account: ${penderita_username} has been linked to KELUARGA Account: ${username}`,
                        data: {
                            penderita_id: (yield hubungan).penderita_id,
                            keluarga_id: (yield hubungan).keluarga_id
                        }
                    });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to create PENDERITA connection by PENDERITA Username: ${error.message}` });
                res.status(500).json({ message: `Failed to create PENDERITA connection by PENDERITA Username: ${error.message}` });
            }
        });
    }
    // AUTHORIZED ENDPOINT
    createPenderitaConnectionByPenderitaDetailData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { username, penderita_username } = req.params;
                    const hubungan = yield this.hubunganPenderitaService.createHubunganPenderitaByPenderitaUsername(username, penderita_username);
                    if (!hubungan) {
                        logger_1.default.error({ message: 'Cannot Create Connection to PENDERITA Account' });
                        res.status(404).json({ message: 'Cannot Create Connection to PENDERITA Account' });
                        return;
                    }
                    logger_1.default.info(` PENDERITA Account: ${penderita_username} has been linked to KELUARGA Account: ${username}`);
                    res.status(200).json({
                        message: `PENDERITA Account: ${penderita_username} has been linked to KELUARGA Account: ${username}`,
                        data: {
                            penderita_id: hubungan.penderita_id,
                            keluarga_id: hubungan.keluarga_id
                        }
                    });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to create PENDERITA connection by PENDERITA DETAIL data: ${error.message}` });
                res.status(500).json({ message: `Failed to create PENDERITA connection by PENDERITA DETAIL data: ${error.message}` });
            }
        });
    }
    // AUTHORIZED ENDPOINT
    getAllPenderitaByImperfectDetailPenderitaData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { username } = req.params;
                    const { penderita_nama, penderita_alamat_rumah, penderita_tanggal_lahir, penderita_gender } = req.body;
                    const penderitaList = yield this.hubunganPenderitaService.getAllPenderitaByImperfectDetailPenderitaData(username, {
                        penderita_nama,
                        penderita_alamat_rumah,
                        penderita_tanggal_lahir: new Date(penderita_tanggal_lahir),
                        penderita_gender
                    });
                    // if (!penderitaList) {
                    //   logger.error({ message: 'PENDERITA Account not found' })
                    //   res.status(404).json({ message: 'PENDERITA Account not found' });
                    //   return;
                    // }
                    logger_1.default.info(` Similar PENDERITA Accounts has been found `);
                    res.status(200).json({
                        message: `Similar PENDERITA Accounts has been found`,
                        data: penderitaList
                    });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to create PENDERITA connection by PENDERITA DETAIL data: ${error.message}` });
                res.status(500).json({ message: `Failed to create PENDERITA connection by PENDERITA DETAIL data: ${error.message}` });
            }
        });
    }
    // AUTHORIZED ENDPOINT
    updateDataKeluargaByKeluargaUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { username } = req.params;
                    const { nama, nomor_hp } = req.body;
                    const [updatedRows, updatedDetailKeluarga] = yield this.detailKeluargaService.updateDetailKeluargaByKeluargaUsername(username, {
                        nama,
                        nomor_hp
                    });
                    if (!updatedDetailKeluarga) {
                        logger_1.default.error({ message: 'KELUARGA Account not found' });
                        res.status(404).json({ message: 'KELUARGA Account not found' });
                        return;
                    }
                    if (updatedRows === 0) {
                        logger_1.default.error({ message: 'KELUARGA Account not found' });
                        res.status(404).json({ message: 'KELUARGA Account not found' });
                        return;
                    }
                    logger_1.default.info(` Data DETAIL KELUARGA: ${username} has been updated`);
                    res.status(200).json({
                        message: `Data DETAIL KELUARGA: ${username} has been updated`,
                        data: JSON.stringify(updatedDetailKeluarga[0]),
                    });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to update Data DETAIL KELUARGA: ${error.message}` });
                res.status(500).json({ message: `Failed to update Data DETAIL KELUARGA: ${error.message}` });
            }
        });
    }
    // AUTHORIZED ENDPOINT
    deleteKeluargaAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { username } = req.params;
                    const deleteRows = yield this.detailKeluargaService.deleteKeluargaAccountByKeluargaUsername(username);
                    if (deleteRows === 0) {
                        logger_1.default.error({ message: 'KELUARGA Account not found' });
                        res.status(404).json({ message: 'KELUARGA Account not found' });
                        return;
                    }
                    logger_1.default.info(`KELUARGA Account: ${username} has been deleted`);
                    res.status(200).json({
                        message: `KELUARGA Account: ${username} has been deleted`,
                    });
                    res.status(204).end();
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to delete KELUARGA Account: ${error.message}` });
                res.status(500).json({ message: `Failed to delete KELUARGA Account: ${error.message}` });
            }
        });
    }
}
exports.default = KeluargaController;
