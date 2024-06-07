import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.utils';
import dotenv from "dotenv";
dotenv.config();
import config from 'config';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Fetch the access token private key
const accessTokenPublicKey = config.get('accessTokenPublicKey');

// Ensure the key is defined
if (!accessTokenPublicKey) {
  throw new Error('accessTokenPublicKey is not defined in the configuration');
}

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const { valid, expired, decoded } = verifyJwt(token, 'accessTokenPublicKey');

    if (valid) {
      (req as any).user = decoded; // Menyimpan user ke dalam request
      next();
    } else if (expired) {
        return res.status(401).json({ message: 'Token expired' });
    } else {
      res.status(expired ? 401 : 403).json({ message: expired ? 'Token expired' : 'Unauthorized' });
    }
  } else {
    res.sendStatus(401);
  }
};