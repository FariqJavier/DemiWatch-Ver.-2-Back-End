import { Request, Response } from 'express';
import logger from '../utils/logger'
import AuthService from '../service/auth.service';

class RefreshToken {

    constructor(
        private readonly authService: AuthService,
      ) {} // Receives service as an argument

    async refreshAccessToken(req: Request, res: Response): Promise<any> {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                logger.error({ message: 'Refresh token is required' })
                return res.status(401).json({ message: 'Refresh token is required' });
            }
            const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
            if (!newAccessToken) {
                logger.error({ message: 'Invalid refresh token' })
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
            res.status(200).json({ 
                message: `Access Token has been renewed`,
                data: newAccessToken
            });

        } catch (error: any) {
            logger.error({ message: `Failed to renew Access Token: ${error.message}` })
            res.status(500).json({ message: `Failed to renew Access Token: ${error.message}` });
        }
    }
}

export default RefreshToken;