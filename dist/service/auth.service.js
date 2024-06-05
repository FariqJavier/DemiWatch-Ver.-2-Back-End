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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_utils_1 = require("../utils/jwt.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const custom_environment_variables_1 = __importDefault(require("../../config/custom-environment-variables"));
// import DeviceFamilyDetail from '../models/detailKeluarga.model';
// import DeviceFamily from '../models/deviceFamily.model';
const keluarga_model_1 = __importDefault(require("../models/keluarga.model"));
const { Op } = require('sequelize');
class AuthService {
    validatePenderitaAccount(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const penderita = yield penderita_model_1.default.findOne({
                    where: {
                        [Op.or]: [
                            { username: username },
                        ]
                    }
                });
                if (penderita && (yield bcrypt_1.default.compare(password, penderita.password))) {
                    const payload = {
                        id: penderita.penderita_id,
                        username: penderita.username,
                    };
                    const accessToken = (0, jwt_utils_1.signJwt)(payload, 'accessTokenPrivateKey', { expiresIn: '1h' });
                    const refreshToken = (0, jwt_utils_1.signJwt)(payload, 'refreshTokenPrivateKey', { expiresIn: '7d' });
                    yield penderita.update({ refreshToken });
                    return {
                        id: penderita.penderita_id,
                        username: penderita.username,
                        accessToken,
                        refreshToken
                    };
                }
            }
            catch (error) {
                throw new Error(`Failed to validate PENDERITA Account: ${error}`);
            }
        });
    }
    validateKeluargaAccount(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keluarga = yield keluarga_model_1.default.findOne({
                    where: {
                        [Op.or]: [
                            { username: username },
                        ]
                    }
                });
                if (keluarga && (yield bcrypt_1.default.compare(password, keluarga.password))) {
                    const payload = {
                        id: keluarga.keluarga_id,
                        username: keluarga.username,
                    };
                    const accessToken = (0, jwt_utils_1.signJwt)(payload, 'accessTokenPrivateKey', { expiresIn: '1h' });
                    const refreshToken = (0, jwt_utils_1.signJwt)(payload, 'refreshTokenPrivateKey', { expiresIn: '7d' });
                    yield keluarga.update({ refreshToken });
                    return {
                        id: keluarga.keluarga_id,
                        username: keluarga.username,
                        accessToken,
                        refreshToken
                    };
                }
            }
            catch (error) {
                throw new Error(`Failed to validate KELUARGA ACCOUNT: ${error}`);
            }
        });
    }
    // async validateRelatedDeviceFamilyMacAddress(patient_family_id: string, mac_address_hex: string) {
    //   try {
    //     const relatedDeviceFamily = await DeviceFamilyDetail.findAll({ 
    //       where: {patient_family_id: patient_family_id} 
    //     });
    //     const deviceFamilyIds = relatedDeviceFamily.map(device => device.device_family_id);
    //     // Ambil semua detail perangkat yang sesuai dengan device family IDs
    //     const deviceFamilyDetails = await DeviceFamily.findAll({
    //       where: {
    //         device_family_id: deviceFamilyIds
    //       }
    //     });
    //     // Buat mapping dari device family ID ke MAC address
    //     const deviceFamilyMap = new Map(deviceFamilyDetails.map(device => [device.device_family_id, device.mac_address_hex]));
    //     // Validasi apakah setiap related device memiliki MAC address yang cocok
    //     for (const relatedDevice of relatedDeviceFamily) {
    //       const deviceId = relatedDevice.device_family_id;
    //       const deviceMacAddress = deviceFamilyMap.get(deviceId);
    //       if (!deviceMacAddress && deviceMacAddress != mac_address_hex) {
    //         return false;
    //       }
    //     }
    //     // for (const relatedDevice of relatedDeviceFamily){
    //     //   const deviceId = relatedDevice.device_family_id;
    //     //   const deviceFamilyDetail = await DeviceFamily.findOne({ 
    //     //     where: { device_family_id: deviceId } 
    //     //   });
    //     //   if (!deviceFamilyDetail || deviceFamilyDetail.mac_address_hex !== mac_address_hex) {
    //     //     return false
    //     //   }
    //     // }
    //     return true;
    //   } catch (error: any) {
    //     throw new Error(`Failed to validate MAC Address Patient Family: ${error}`);
    //   }
    // };
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = jsonwebtoken_1.default.verify(refreshToken, Buffer.from(custom_environment_variables_1.default.refreshTokenPublicKey, 'base64').toString('ascii'));
                const newAccessToken = (0, jwt_utils_1.signJwt)({ id: payload.id, username: payload.username }, 'accessTokenPrivateKey', { expiresIn: '1h' });
                return newAccessToken;
            }
            catch (error) {
                return new Error(`Failed to refresh Access Token: ${error}`);
            }
        });
    }
}
exports.default = AuthService;
