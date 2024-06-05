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
class RefreshToken {
    constructor(authService) {
        this.authService = authService;
    } // Receives service as an argument
    refreshAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    logger_1.default.error({ message: 'Refresh token is required' });
                    return res.status(401).json({ message: 'Refresh token is required' });
                }
                const newAccessToken = yield this.authService.refreshAccessToken(refreshToken);
                if (!newAccessToken) {
                    logger_1.default.error({ message: 'Invalid refresh token' });
                    return res.status(403).json({ message: 'Invalid refresh token' });
                }
                res.status(200).json({
                    message: `Access Token has been renewed`,
                    data: newAccessToken
                });
            }
            catch (error) {
                logger_1.default.error({ message: `Failed to renew Access Token: ${error.message}` });
                res.status(500).json({ message: `Failed to renew Access Token: ${error.message}` });
            }
        });
    }
}
exports.default = RefreshToken;
