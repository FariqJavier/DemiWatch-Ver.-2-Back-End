"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const { valid, expired, decoded } = (0, jwt_utils_1.verifyJwt)(token, 'accessTokenPublicKey');
        if (valid) {
            req.user = decoded; // Menyimpan user ke dalam request
            next();
        }
        else if (expired) {
            return res.status(401).json({ message: 'Token expired' });
        }
        else {
            res.status(expired ? 401 : 403).json({ message: expired ? 'Token expired' : 'Unauthorized' });
        }
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJWT = authenticateJWT;
