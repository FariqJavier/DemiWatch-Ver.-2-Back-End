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
const penderita_model_1 = __importDefault(require("../models/penderita.model"));
class PenderitaService {
    createPenderita(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield penderita_model_1.default.create(data);
                return penderita;
            }
            catch (error) {
                throw new Error(`Failed to create Penderita Account: ${error}`);
            }
        });
    }
    getPenderitaByPenderitaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield penderita_model_1.default.findOne({
                    where: { username: username }
                });
                return penderita;
            }
            catch (error) {
                throw new Error(`Failed to get Penderita Account: ${error}`);
            }
        });
    }
    getPenderitaByPenderitaId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield penderita_model_1.default.findOne({
                    where: { penderita_id: id }
                });
                return penderita;
            }
            catch (error) {
                throw new Error(`Failed to get Penderita Account: ${error}`);
            }
        });
    }
    updatePenderitaByPenderitaUsername(username, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Filter out null properties
                const filteredData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null));
                const penderita = yield this.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                const [updatedRows, updatedPenderita] = yield penderita_model_1.default.update(filteredData, {
                    where: {
                        penderita_id: penderita.penderita_id
                    },
                    returning: true,
                });
                return [updatedRows, updatedPenderita];
            }
            catch (error) {
                throw new Error(`Failed to update Penderita Account: ${error}`);
            }
        });
    }
    deletePenderitaByPenderitaUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield this.getPenderitaByPenderitaUsername(username);
                // Check if the penderita was found
                if (!penderita) {
                    throw new Error('Penderita Account not found');
                }
                const deletedRows = yield penderita_model_1.default.destroy({
                    where: { penderita_id: penderita.penderita_id }
                });
                return deletedRows;
            }
            catch (error) {
                throw new Error(`Failed to delete Penderita Account: ${error}`);
            }
        });
    }
}
exports.default = PenderitaService;
