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
const detailKeluarga_model_1 = __importDefault(require("../models/detailKeluarga.model"));
class DetailKeluargaService {
    constructor(keluargaService) {
        this.keluargaService = keluargaService;
    } // Receives service as an argument
    createDetailKeluarga(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detailKeluarga = yield detailKeluarga_model_1.default.create(data);
                return detailKeluarga;
            }
            catch (error) {
                throw new Error(`Failed to create Detail Keluarga for Keluarga ID: ${error}`);
            }
        });
    }
    getDetailKeluargaByKeluargaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.keluargaService.getKeluargaByKeluargaUsername(username);
                // Check if the penderita was found
                if (!keluarga) {
                    throw new Error('Keluarga Account not found');
                }
                const detailKeluarga = yield detailKeluarga_model_1.default.findOne({
                    where: { keluarga_id: keluarga.keluarga_id }
                });
                return detailKeluarga;
            }
            catch (error) {
                throw new Error(`Failed to get Detail Keluarga by Keluarga Username Account: ${error}`);
            }
        });
    }
    getDetailKeluargaByKeluargaId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detailKeluarga = yield detailKeluarga_model_1.default.findByPk(id);
                return detailKeluarga;
            }
            catch (error) {
                throw new Error(`Failed to get Detail Keluarga by Keluarga Username Account: ${error}`);
            }
        });
    }
    updateDetailKeluargaByKeluargaUsername(username, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.keluargaService.getKeluargaByKeluargaUsername(username);
                // Check if the Keluarga was found
                if (!keluarga) {
                    throw new Error('Keluarga Account not found');
                }
                // Filter out null properties
                const filteredData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null));
                const [updatedRows, updatedDetailKeluarga] = yield detailKeluarga_model_1.default.update(filteredData, {
                    where: { keluarga_id: keluarga.keluarga_id },
                    returning: true,
                });
                return [updatedRows, updatedDetailKeluarga];
            }
            catch (error) {
                throw new Error(`Failed to update Detail Keluarga by Keluarga Username Account: ${error}`);
            }
        });
    }
    deleteKeluargaAccountByKeluargaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.keluargaService.getKeluargaByKeluargaUsername(username);
                // Check if the penderita was found
                if (!keluarga) {
                    throw new Error('Keluarga Account not found');
                }
                const deleteDetailKeluargaRows = yield detailKeluarga_model_1.default.destroy({
                    where: { keluarga_id: keluarga.keluarga_id }
                });
                const deleteKeluargaRows = yield this.keluargaService.deleteKeluargaByKeluargaUsername(username);
                return deleteDetailKeluargaRows;
            }
            catch (error) {
                throw new Error(`Failed to delete Detail Keluarga and Keluarga account by Keluarga Username Account: ${error}`);
            }
        });
    }
}
exports.default = DetailKeluargaService;
