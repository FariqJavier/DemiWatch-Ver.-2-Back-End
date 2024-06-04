import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import bcrypt from 'bcrypt';
import logger from "../utils/logger";
import PenderitaService from '../service/penderita.service';
import DetailPenderitaService from '../service/detailPenderita.service';
import HubunganPenderitaService from '../service/hubunganPenderita.service';
import AuthService from "../service/auth.service"

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Adjust as needed (higher = slower, more secure)
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

class PenderitaController {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly detailPenderitaService: DetailPenderitaService,
    private readonly hubunganPenderitaService: HubunganPenderitaService,
    private readonly authService: AuthService,
  ) {} // Receives service as an argument

  // Unauthorized Endpoint
  async registerPenderitaAccount(req: Request, res: Response): Promise<void> {
    try {
      const penderitaUUID = uuidv4();
      const detailPenderitaUUID = uuidv4();
      const { 
        username,
        password, 
        nama,
        alamat_rumah,
        tanggal_lahir,
        gender} = req.body;
      
      const hashed_password = await hashPassword(password);

      const penderita = await this.penderitaService.createPenderita({
        penderita_id: penderitaUUID,
        username,
        password: hashed_password,
      });
      logger.info(`PENDERITA created succesfully`);

      const detailPenderita = await this.detailPenderitaService.createDetailPenderita({
        detail_penderita_id: detailPenderitaUUID,
        penderita_id: penderitaUUID,
        nama,
        alamat_rumah,
        tanggal_lahir: new Date(tanggal_lahir),
        gender,
      });
      logger.info(`DETAIL PENDERITA created succesfully`);

      res.status(201).json({
        message: 'PENDERITA ACCOUNT created successfully',
        data: {
          penderita: penderita,
          detailPenderita: detailPenderita
        }
      })

    } catch (error: any) {
      logger.error({ message: `Failed to create PENDERITA ACCOUNT: ${error.message}` })
      res.status(500).json({ message: `Failed to create PENDERITA ACCOUNT: ${error.message}` });
    }
  }

  // Unauthorized Endpoint
  async loginPenderitaAccount(req: Request, res: Response): Promise<void> {
    try {
      const { 
        username,
        password } = req.body;
      const penderita = await this.authService.validatePenderitaAccount(username, password);
      if (penderita) {
        logger.info(`Penderita: ${username} has been authenticated`);
        res.status(200).json({
          message: `Penderita: ${username} has been authenticated`,
          data: {
            patient_id: penderita.id,
            username: penderita.username,
            accessToken: penderita.accessToken,
            refreshToken: penderita.refreshToken,
          }, // Bisa berisi token atau informasi user lainnya
        });
      } else {
        logger.error({ message: 'Invalid username or password' });
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to login PENDERITA ACCOUNT: ${error.message}` });
      res.status(500).json({ message: `Failed to login PENDERITA ACCOUNT: ${error.message}` });
    }
  }

  // Unauthorized Endpoint
  async getPenderitaProfile(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;

      const detailPenderita = await this.detailPenderitaService.getDetailPenderitaByPenderitaUsername( username );
      if (!detailPenderita) {
        logger.error({ message: 'PENDERITA Account not found' })
        res.status(404).json({ message: 'PENDERITA Account not found' });
        return;
     }
      logger.info(`PENDERITA Account has been found`);

      const detailKeluarga = await this.hubunganPenderitaService.getDetailKeluargaByPenderitaUsername( username );
      if (!detailKeluarga) {
        logger.error({ message: 'KELUARGA Account not found' })
        res.status(404).json({ message: 'KELUARGA Account not found' });
        return;
     }
     if (detailKeluarga.length == 0){
      logger.info(`KELUARGA Account linked to PENDERITA Account not found`);
      res.status(201).json({
        message: 'DETAIL PENDERITA has been found BUT DETAIL KELUARGA linked to PENDERITA Account not found',
        data: {
          detailPenderita: detailPenderita,
          detailKeluarga: detailKeluarga
        }
      })
     } else {
      logger.info(`KELUARGA Account linked to PENDERITA Account has been found`);
      res.status(201).json({
        message: 'DETAIL PENDERITA AND DETAIL KELUARGA linked to PENDERITA Account has been found',
        data: {
          detailPenderita: detailPenderita,
          detailKeluarga: detailKeluarga
        }
      })
     }
    } catch (error: any) {
      logger.error({ message: `Failed to get PENDERITA ACCOUNT: ${error.message}` })
      res.status(500).json({ message: `Failed to get PENDERITA ACCOUNT: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async updateDataPenderitaByPenderitaUsername(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { username } = req.params;
        const { 
          nama,
          alamat_rumah,
          tanggal_lahir,
          gender } = req.body;
        const [updatedRows, updatedDetailPenderita] = await this.detailPenderitaService.updateDetailPenderitaByPenderitaUsername(username, {
          nama,
          alamat_rumah,
          tanggal_lahir: new Date(tanggal_lahir),
          gender
        })
        if (!updatedDetailPenderita) {
          logger.error({ message: 'PENDERITA Account not found' })
          res.status(404).json({ message: 'PENDERITA Account not found' });
          return;
        }
        if (updatedRows === 0) {
          logger.error({ message: 'PENDERITA Account not found' })
          res.status(404).json({ message: 'PENDERITA Account not found' });
          return;
        }
        logger.info(` Data DETAIL PENDERITA: ${username} has been updated`);

        res.status(200).json({
          message: `Data DETAIL PENDERITA: ${username} has been updated`,
          data: JSON.stringify(updatedDetailPenderita[0]), 
        });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to update Data DETAIL PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to update Data DETAIL PENDERITA: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async deletePenderitaAccount(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { username } = req.params;
        const deleteRows = await this.detailPenderitaService.deletePenderitaAccountByPenderitaUsername(username)
        if (deleteRows === 0) {
          logger.error({ message: 'PENDERITA Account not found' })
          res.status(404).json({ message: 'PENDERITA Account not found' });
          return;
        }
        logger.info(`PENDERITA Account: ${username} has been deleted`);

        res.status(200).json({
          message: `PENDERITA Account: ${username} has been deleted`,
        });
        res.status(204).end()
      }
    } catch (error: any) {
      logger.error({ message: `Failed to delete PENDERITA Account: ${error.message}` })
      res.status(500).json({ message: `Failed to delete PENDERITA Account: ${error.message}` });
    }
  }

}

export default PenderitaController;