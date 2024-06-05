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
const keluarga_model_1 = __importDefault(require("../models/keluarga.model"));
class KeluargaService {
    createKeluarga(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield keluarga_model_1.default.create(data);
                return keluarga;
            }
            catch (error) {
                throw new Error(`Failed to create Keluarga Account: ${error}`);
            }
        });
    }
    getKeluargaByKeluargaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield keluarga_model_1.default.findOne({
                    where: { username: username }
                });
                return keluarga;
            }
            catch (error) {
                throw new Error(`Failed to get Keluarga Account: ${error}`);
            }
        });
    }
    updateKeluargaByKeluargaUsername(username, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Filter out null properties
                const filteredData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null));
                const keluarga = yield this.getKeluargaByKeluargaUsername(username);
                // Check if the Keluarga was found
                if (!keluarga) {
                    throw new Error('Keluarga Account not found');
                }
                const [updatedRows, updatedKeluarga] = yield keluarga_model_1.default.update(filteredData, {
                    where: {
                        keluarga_id: keluarga.keluarga_id
                    },
                    returning: true,
                });
                return [updatedRows, updatedKeluarga];
            }
            catch (error) {
                throw new Error(`Failed to update Keluarga Account: ${error}`);
            }
        });
    }
    deleteKeluargaByKeluargaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield this.getKeluargaByKeluargaUsername(username);
                // Check if the keluarga was found
                if (!keluarga) {
                    throw new Error('Keluarga Account not found');
                }
                const deletedRows = yield keluarga_model_1.default.destroy({
                    where: { keluarga_id: keluarga.keluarga_id }
                });
                return deletedRows;
            }
            catch (error) {
                throw new Error(`Failed to delete Keluarga Account: ${error}`);
            }
        });
    }
}
exports.default = KeluargaService;
