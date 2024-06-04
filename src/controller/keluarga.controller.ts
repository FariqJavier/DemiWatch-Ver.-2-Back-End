import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import bcrypt from 'bcrypt';
import logger from "../utils/logger";
import KeluargaService from '../service/keluarga.service';
import DetailKeluargaService from '../service/detailKeluarga.service';
import PenderitaService from '../service/penderita.service';
import HubunganPenderitaService from '../service/hubunganPenderita.service';
import AuthService from "../service/auth.service"

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Adjust as needed (higher = slower, more secure)
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

class KeluargaController {

  constructor(
    private readonly keluargaService: KeluargaService,
    private readonly detailKeluargaService: DetailKeluargaService,
    private readonly penderitaService: PenderitaService,
    private readonly hubunganPenderitaService: HubunganPenderitaService,
    private readonly authService: AuthService,
  ) {} // Receives service as an argument

  // Unauthorized Endpoint
  async registerKeluargaAccount(req: Request, res: Response): Promise<void> {
    try {
      const keluargaUUID = uuidv4();
      const detailKeluargaUUID = uuidv4();
      const { 
        username,
        password, 
        nama,
        nomor_hp} = req.body;
      
      const hashed_password = await hashPassword(password);

      const keluarga = await this.keluargaService.createKeluarga({
        keluarga_id: keluargaUUID,
        username,
        password: hashed_password,
      });
      logger.info(`KELUARGA created succesfully`);

      const detailKeluarga = await this.detailKeluargaService.createDetailKeluarga({
        detail_keluarga_id: detailKeluargaUUID,
        keluarga_id: keluargaUUID,
        nama,
        nomor_hp,
      });
      logger.info(`DETAIL KELUARGA created succesfully`);

      res.status(201).json({
        message: 'KELUARGA ACCOUNT created successfully',
        data: {
          keluarga: keluarga,
          detailKeluarga: detailKeluarga
        }
      })

    } catch (error: any) {
      logger.error({ message: `Failed to create KELUARGA ACCOUNT: ${error.message}` })
      res.status(500).json({ message: `Failed to create KELUARGA ACCOUNT: ${error.message}` });
    }
  }

  // Unauthorized Endpoint
  async loginKeluargaAccount(req: Request, res: Response): Promise<void> {
    try {
      const { 
        username,
        password } = req.body;
      const keluarga = await this.authService.validateKeluargaAccount(username, password);
      if (keluarga) {
        logger.info(`KELUARGA: ${username} has been authenticated`);
        res.status(200).json({
          message: `KELUARGA: ${username} has been authenticated`,
          data: {
            keluarga_id: keluarga.id,
            username: keluarga.username,
            accessToken: keluarga.accessToken,
            refreshToken: keluarga.refreshToken,
          }, // Bisa berisi token atau informasi user lainnya
        });
      } else {
        logger.error({ message: 'Invalid username or password' });
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to login KELUARGA ACCOUNT: ${error.message}` });
      res.status(500).json({ message: `Failed to login KELUARGA ACCOUNT: ${error.message}` });
    }
  }

  // Unauthorized Endpoint
  async getKeluargaProfile(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;

      const detailKeluarga = await this.detailKeluargaService.getDetailKeluargaByKeluargaUsername( username );
      if (!detailKeluarga) {
        logger.error({ message: 'KELUARGA Account not found' })
        res.status(404).json({ message: 'KELUARGA Account not found' });
        return;
     }
      logger.info(`KELUARGA Account has been found`);

      const detailPenderita = await this.hubunganPenderitaService.getDetailPenderitaByKeluargaUsername( username );
      if (!detailPenderita) {
        logger.error({ message: 'PENDERITA Account not found' })
        res.status(404).json({ message: 'PENDERITA Account not found' });
        return;
     }
      logger.info(`PENDERITA Account linked to KELUARGA Account has been found`);

      res.status(201).json({
        message: 'DETAIL PENDERITA AND DETAIL KELUARGA linked to KELUARGA Account has been found',
        data: {
          detailKeluarga: detailKeluarga,
          detailPenderita: detailPenderita,
        }
      })

    } catch (error: any) {
      logger.error({ message: `Failed to get KELUARGA ACCOUNT: ${error.message}` })
      res.status(500).json({ message: `Failed to get KELUARGA ACCOUNT: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async createPenderitaConnectionByPenderitaUsername(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { username } = req.params;
        const { 
          penderita_username } = req.body;
        const hubungan = await this.hubunganPenderitaService.createHubunganPenderitaByPenderitaData(
          username, {
            penderita_username
          }
        )
        if (!hubungan) {
          logger.error({ message: 'Cannot Create Connection to PENDERITA Account' })
          res.status(404).json({ message: 'Cannot Create Connection to PENDERITA Account' });
          return;
        }

        logger.info(` PENDERITA Account: ${penderita_username} has been linked to KELUARGA Account: ${username}`);
        res.status(200).json({
          message: `PENDERITA Account: ${penderita_username} has been linked to KELUARGA Account: ${username}`,
          data: {
            penderita_id: (await hubungan).penderita_id,
            keluarga_id: (await hubungan).keluarga_id
          } 
        });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create PENDERITA connection by PENDERITA Username: ${error.message}` })
      res.status(500).json({ message: `Failed to create PENDERITA connection by PENDERITA Username: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async createPenderitaConnectionByPenderitaDetailData(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { 
          username,
          penderita_username } = req.params;
        const hubungan = await this.hubunganPenderitaService.createHubunganPenderitaByPenderitaUsername(
          username,
          penderita_username
        )
        if (!hubungan) {
          logger.error({ message: 'Cannot Create Connection to PENDERITA Account' })
          res.status(404).json({ message: 'Cannot Create Connection to PENDERITA Account' });
          return;
        }

        logger.info(` PENDERITA Account: ${penderita_username} has been linked to KELUARGA Account: ${username}`);
        res.status(200).json({
          message: `PENDERITA Account: ${penderita_username} has been linked to KELUARGA Account: ${username}`,
          data: {
            penderita_id: hubungan.penderita_id,
            keluarga_id: hubungan.keluarga_id
          } 
        });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create PENDERITA connection by PENDERITA DETAIL data: ${error.message}` })
      res.status(500).json({ message: `Failed to create PENDERITA connection by PENDERITA DETAIL data: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async getAllPenderitaByImperfectDetailPenderitaData(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { username } = req.params;
        const { 
          penderita_nama,
          penderita_alamat_rumah,
          penderita_tanggal_lahir,
          penderita_gender } = req.body;
        const penderitaList = await this.hubunganPenderitaService.getAllPenderitaByImperfectDetailPenderitaData(
          username, {
            penderita_nama,
            penderita_alamat_rumah,
            penderita_tanggal_lahir: new Date(penderita_tanggal_lahir),
            penderita_gender
          }
        )
        // if (!penderitaList) {
        //   logger.error({ message: 'PENDERITA Account not found' })
        //   res.status(404).json({ message: 'PENDERITA Account not found' });
        //   return;
        // }

        logger.info(` Similar PENDERITA Accounts has been found `);
        res.status(200).json({
          message: `Similar PENDERITA Accounts has been found`,
          data: penderitaList
        });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create PENDERITA connection by PENDERITA DETAIL data: ${error.message}` })
      res.status(500).json({ message: `Failed to create PENDERITA connection by PENDERITA DETAIL data: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async updateDataKeluargaByKeluargaUsername(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { username } = req.params;
        const { 
          nama,
          nomor_hp } = req.body;
        const [updatedRows, updatedDetailKeluarga] = await this.detailKeluargaService.updateDetailKeluargaByKeluargaUsername(username, {
          nama,
          nomor_hp
        })
        if (!updatedDetailKeluarga) {
          logger.error({ message: 'KELUARGA Account not found' })
          res.status(404).json({ message: 'KELUARGA Account not found' });
          return;
        }
        if (updatedRows === 0) {
          logger.error({ message: 'KELUARGA Account not found' })
          res.status(404).json({ message: 'KELUARGA Account not found' });
          return;
        }
        logger.info(` Data DETAIL KELUARGA: ${username} has been updated`);

        res.status(200).json({
          message: `Data DETAIL KELUARGA: ${username} has been updated`,
          data: JSON.stringify(updatedDetailKeluarga[0]), 
        });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to update Data DETAIL KELUARGA: ${error.message}` })
      res.status(500).json({ message: `Failed to update Data DETAIL KELUARGA: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async deleteKeluargaAccount(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { username } = req.params;
        const deleteRows = await this.detailKeluargaService.deleteKeluargaAccountByKeluargaUsername(username)
        if (deleteRows === 0) {
          logger.error({ message: 'KELUARGA Account not found' })
          res.status(404).json({ message: 'KELUARGA Account not found' });
          return;
        }
        logger.info(`KELUARGA Account: ${username} has been deleted`);

        res.status(200).json({
          message: `KELUARGA Account: ${username} has been deleted`,
        });
        res.status(204).end()
      }
    } catch (error: any) {
      logger.error({ message: `Failed to delete KELUARGA Account: ${error.message}` })
      res.status(500).json({ message: `Failed to delete KELUARGA Account: ${error.message}` });
    }
  }

}

export default KeluargaController;