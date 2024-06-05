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
const hubunganPenderita_model_1 = __importDefault(require("../models/hubunganPenderita.model"));
class HubunganPenderitaService {
    constructor(keluargaService, penderitaService, detailPenderitaService, detailKeluargaService) {
        this.keluargaService = keluargaService;
        this.penderitaService = penderitaService;
        this.detailPenderitaService = detailPenderitaService;
        this.detailKeluargaService = detailKeluargaService;
    } // Receives service as an argument
    createHubunganPenderitaByPenderitaData(keluarga_username, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.keluargaService.getKeluargaByKeluargaUsername(keluarga_username);
                // Check if the penderita was found
                if (!keluarga) {
                    throw new Error('KELUARGA Account not found');
                }
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(data.penderita_username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('PENDERITA Account not found');
                }
                const dataHubungan = {
                    penderita_id: penderita.penderita_id,
                    keluarga_id: keluarga.keluarga_id
                };
                const hubungan = yield hubunganPenderita_model_1.default.create(dataHubungan);
                return hubungan;
            }
            catch (error) {
                throw new Error(`Failed to create HUBUNGAN PENDERITA KELUARGA: ${error}`);
            }
        });
    }
    createHubunganPenderitaByPenderitaUsername(keluarga_username, penderita_username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.keluargaService.getKeluargaByKeluargaUsername(keluarga_username);
                // Check if the penderita was found
                if (!keluarga) {
                    throw new Error('KELUARGA Account not found');
                }
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(penderita_username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('PENDERITA Account not found');
                }
                const dataHubungan = {
                    penderita_id: penderita.penderita_id,
                    keluarga_id: keluarga.keluarga_id
                };
                const hubungan = yield hubunganPenderita_model_1.default.create(dataHubungan);
                return hubungan;
            }
            catch (error) {
                throw new Error(`Failed to create HUBUNGAN PENDERITA KELUARGA: ${error}`);
            }
        });
    }
    getAllPenderitaByImperfectDetailPenderitaData(keluarga_username, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.keluargaService.getKeluargaByKeluargaUsername(keluarga_username);
                // Check if the penderita was found
                if (!keluarga) {
                    throw new Error('KELUARGA Account not found');
                }
                const penderitaList = yield this.detailPenderitaService.getDetailPenderitaByImperfectDetailPenderitaData({
                    nama: data.penderita_nama,
                    alamat_rumah: data.penderita_alamat_rumah,
                    tanggal_lahir: data.penderita_tanggal_lahir,
                    gender: data.penderita_gender
                });
                if (!penderitaList) {
                    throw new Error('PENDERITA Account not found');
                }
                if (penderitaList.length < 1) {
                    throw new Error('PENDERITA Account not found');
                }
                return penderitaList;
            }
            catch (error) {
                throw new Error(`Failed to get All PENDERITA Account: ${error}`);
            }
        });
    }
    getHubunganPenderitaByPenderitaId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hubungan = yield hubunganPenderita_model_1.default.findAll({
                    where: { penderita_id: id },
                    attributes: ['penderita_id', 'keluarga_id']
                });
                return hubungan;
            }
            catch (error) {
                throw new Error(`Failed to get HUBUNGAN PENDERITA By PENDERITA ID ${error}`);
            }
        });
    }
    getHubunganPenderitaByKeluargaId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hubungan = yield hubunganPenderita_model_1.default.findAll({
                    where: { keluarga_id: id },
                    attributes: ['penderita_id', 'keluarga_id']
                });
                // Check if the penderita was found
                if (!hubungan) {
                    throw new Error('KELUARGA Account has not been connected to any PENDERITA Account');
                }
                return hubungan;
            }
            catch (error) {
                throw new Error(`Failed to get HUBUNGAN PENDERITA By KELUARGA ID ${error}`);
            }
        });
    }
    getHubunganPenderitaByKeluargaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.keluargaService.getKeluargaByKeluargaUsername(username);
                // Check if the penderita was found
                if (!keluarga) {
                    throw new Error('KELUARGA Account has not found');
                }
                const hubungan = yield hubunganPenderita_model_1.default.findAll({
                    where: { keluarga_id: keluarga.keluarga_id },
                    attributes: ['penderita_id', 'keluarga_id']
                });
                // Check if the penderita was found
                if (!hubungan) {
                    throw new Error('KELUARGA Account has not been connected to any PENDERITA Account');
                }
                return hubungan;
            }
            catch (error) {
                throw new Error(`Failed to get HUBUNGAN PENDERITA By KELUARGA ID ${error}`);
            }
        });
    }
    getDetailKeluargaByPenderitaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.penderitaService.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('PENDERITA Account not found');
                }
                const hubungan = yield this.getHubunganPenderitaByPenderitaId(penderita.penderita_id);
                // Check if the penderita was found
                if (!hubungan) {
                    throw new Error('PENDERITA Account has not been connected to any KELUARGA Account');
                }
                const detailKeluargaList = [];
                for (const hubunganPenderita of hubungan) {
                    const detailKeluarga = yield this.detailKeluargaService.getDetailKeluargaByKeluargaId(hubunganPenderita.keluarga_id);
                    if (detailKeluarga !== null) {
                        detailKeluargaList.push(detailKeluarga);
                    }
                }
                return detailKeluargaList;
            }
            catch (error) {
                throw new Error(`Failed to get DETAIL KELUARGA by PENDERITA Username ${error}`);
            }
        });
    }
    getDetailPenderitaByKeluargaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.keluargaService.getKeluargaByKeluargaUsername(username);
                // Check if the keluarga was found
                if (!keluarga) {
                    throw new Error('KELUARGA Account not found');
                }
                const hubungan = yield this.getHubunganPenderitaByKeluargaId(keluarga.keluarga_id);
                // Check if the hubungan was found
                if (!hubungan) {
                    throw new Error('KELUARGA Account has not been connected to any PENDERITA Account');
                }
                const detailPenderitaList = [];
                for (const hubunganKeluarga of hubungan) {
                    const detailPenderita = yield this.detailPenderitaService.getDetailPenderitaByPenderitaId(hubunganKeluarga.penderita_id);
                    if (detailPenderita !== null) {
                        detailPenderitaList.push(detailPenderita);
                    }
                }
                return detailPenderitaList;
            }
            catch (error) {
                throw new Error(`Failed to get DETAIL PENDERITA by KELUARGA Username ${error}`);
            }
        });
    }
}
exports.default = HubunganPenderitaService;
