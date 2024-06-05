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
class PenderitaController {
    constructor(penderitaService, detailPenderitaService, hubunganPenderitaService, authService) {
        this.penderitaService = penderitaService;
        this.detailPenderitaService = detailPenderitaService;
        this.hubunganPenderitaService = hubunganPenderitaService;
        this.authService = authService;
    } // Receives service as an argument
    // Unauthorized Endpoint
    registerPenderitaAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderitaUUID = (0, uuid_1.v4)();
                const detailPenderitaUUID = (0, uuid_1.v4)();
                const { username, password, nama, alamat_rumah, tanggal_lahir, gender } = req.body;
                const hashed_password = yield hashPassword(password);
                const penderita = yield this.penderitaService.createPenderita({
                    penderita_id: penderitaUUID,
                    username,
                    password: hashed_password,
                });
                logger_1.default.info(`PENDERITA created succesfully`);
                const detailPenderita = yield this.detailPenderitaService.createDetailPenderita({
                    detail_penderita_id: detailPenderitaUUID,
                    penderita_id: penderitaUUID,
                    nama,
                    alamat_rumah,
                    tanggal_lahir: new Date(tanggal_lahir),
                    gender,
                });
                logger_1.default.info(`DETAIL PENDERITA created succesfully`);
                res.status(201).json({
                    message: 'PENDERITA ACCOUNT created successfully',
                    data: {
                        penderita: penderita,
                        detailPenderita: detailPenderita
                    }
                });
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to create PENDERITA ACCOUNT: ${error.message}` });
                res.status(500).json({ message: `Failed to create PENDERITA ACCOUNT: ${error.message}` });
            }
        });
    }
    // Unauthorized Endpoint
    loginPenderitaAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const penderita = yield this.authService.validatePenderitaAccount(username, password);
                if (penderita) {
                    logger_1.default.info(`Penderita: ${username} has been authenticated`);
                    res.status(200).json({
                        message: `Penderita: ${username} has been authenticated`,
                        data: {
                            patient_id: penderita.id,
                            username: penderita.username,
                            accessToken: penderita.accessToken,
                            refreshToken: penderita.refreshToken,
                        }, // Bisa berisi token atau informasi user lainnya
                    });
                }
                else {
                    logger_1.default.error({ message: 'Invalid username or password' });
                    res.status(401).json({ message: 'Invalid username or password' });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to login PENDERITA ACCOUNT: ${error.message}` });
                res.status(500).json({ message: `Failed to login PENDERITA ACCOUNT: ${error.message}` });
            }
        });
    }
    // Unauthorized Endpoint
    getPenderitaProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                const detailPenderita = yield this.detailPenderitaService.getDetailPenderitaByPenderitaUsername(username);
                if (!detailPenderita) {
                    logger_1.default.error({ message: 'PENDERITA Account not found' });
                    res.status(404).json({ message: 'PENDERITA Account not found' });
                    return;
                }
                logger_1.default.info(`PENDERITA Account has been found`);
                const detailKeluarga = yield this.hubunganPenderitaService.getDetailKeluargaByPenderitaUsername(username);
                if (!detailKeluarga) {
                    logger_1.default.error({ message: 'KELUARGA Account not found' });
                    res.status(404).json({ message: 'KELUARGA Account not found' });
                    return;
                }
                if (detailKeluarga.length == 0) {
                    logger_1.default.info(`KELUARGA Account linked to PENDERITA Account not found`);
                    res.status(201).json({
                        message: 'DETAIL PENDERITA has been found BUT DETAIL KELUARGA linked to PENDERITA Account not found',
                        data: {
                            detailPenderita: detailPenderita,
                            detailKeluarga: detailKeluarga
                        }
                    });
                }
                else {
                    logger_1.default.info(`KELUARGA Account linked to PENDERITA Account has been found`);
                    res.status(201).json({
                        message: 'DETAIL PENDERITA AND DETAIL KELUARGA linked to PENDERITA Account has been found',
                        data: {
                            detailPenderita: detailPenderita,
                            detailKeluarga: detailKeluarga
                        }
                    });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to get PENDERITA ACCOUNT: ${error.message}` });
                res.status(500).json({ message: `Failed to get PENDERITA ACCOUNT: ${error.message}` });
            }
        });
    }
    // AUTHORIZED ENDPOINT
    updateDataPenderitaByPenderitaUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { username } = req.params;
                    const { nama, alamat_rumah, tanggal_lahir, gender } = req.body;
                    const [updatedRows, updatedDetailPenderita] = yield this.detailPenderitaService.updateDetailPenderitaByPenderitaUsername(username, {
                        nama,
                        alamat_rumah,
                        tanggal_lahir: new Date(tanggal_lahir),
                        gender
                    });
                    if (!updatedDetailPenderita) {
                        logger_1.default.error({ message: 'PENDERITA Account not found' });
                        res.status(404).json({ message: 'PENDERITA Account not found' });
                        return;
                    }
                    if (updatedRows === 0) {
                        logger_1.default.error({ message: 'PENDERITA Account not found' });
                        res.status(404).json({ message: 'PENDERITA Account not found' });
                        return;
                    }
                    logger_1.default.info(` Data DETAIL PENDERITA: ${username} has been updated`);
                    res.status(200).json({
                        message: `Data DETAIL PENDERITA: ${username} has been updated`,
                        data: JSON.stringify(updatedDetailPenderita[0]),
                    });
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to update Data DETAIL PENDERITA: ${error.message}` });
                res.status(500).json({ message: `Failed to update Data DETAIL PENDERITA: ${error.message}` });
            }
        });
    }
    // AUTHORIZED ENDPOINT
    deletePenderitaAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const { username } = req.params;
                    const deleteRows = yield this.detailPenderitaService.deletePenderitaAccountByPenderitaUsername(username);
                    if (deleteRows === 0) {
                        logger_1.default.error({ message: 'PENDERITA Account not found' });
                        res.status(404).json({ message: 'PENDERITA Account not found' });
                        return;
                    }
                    logger_1.default.info(`PENDERITA Account: ${username} has been deleted`);
                    res.status(200).json({
                        message: `PENDERITA Account: ${username} has been deleted`,
                    });
                    res.status(204).end();
                }
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to delete PENDERITA Account: ${error.message}` });
                res.status(500).json({ message: `Failed to delete PENDERITA Account: ${error.message}` });
            }
        });
    }
}
exports.default = PenderitaController;
