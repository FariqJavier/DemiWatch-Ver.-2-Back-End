import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import PenderitaService from '../service/penderita.service';
import HubunganPenderitaService from '../service/hubunganPenderita.service';
import RiwayatDetakJantungService from '../service/riwayatDetakJantung.service';

class RiwayatDetakJantungController {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly hubunganPenderitaService: HubunganPenderitaService,
    private readonly riwayatDetakJantungService : RiwayatDetakJantungService,
  ) {} // Receives service as an argument

  // AUTHORIZED ENDPOINT
  async createNewRiwayatDetakJantung(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {    
        var riwayatUUID = uuidv4();

        const { 
          penderita_username } = req.params;

        const { 
            bpm_terakhir } = req.body;

        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }

        const riwayat = await this.riwayatDetakJantungService.createNewRiwayatDetakJantung({
          riwayat_detak_jantung_id: riwayatUUID,
          penderita_id: penderita.penderita_id,
          bpm_terakhir
        })
        logger.info(`RIWAYAT DETAK JANTUNG created succesfully`);

        res.status(201).json({
          message: `RIWAYAT DETAK JANTUNG for PENDERITA ${penderita_username} created successfully`,
          data: riwayat 
        })
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create RIWAYAT DETAK JANTUNG for PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to create RIWAYAT DETAK JANTUNG for PENDERITA: ${error.message}` });
    }
  }

  // UNAUTHORIZED ENDPOINT
  async getLastDayDetakJantungPenderita(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username,
        keluarga_username } = req.params;

      const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('Penderita Account has not been connected to Keluarga Account');
      }

      const riwayat = await this.riwayatDetakJantungService.getLastDayDetakJantungPenderita( penderita_username )
      logger.info(`Last Day DETAK JANTUNG PENDERITA: ${penderita_username} has been found`);
        res.status(200).json({
            message: `Last Day DETAK JANTUNG PENDERITA: ${penderita_username} has been found`,
            data: riwayat, 
        });
    } catch (error: any) {
      logger.error({ message: `Failed to get Last Day DETAK JANTUNG PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to get Last Day DETAK JANTUNG PENDERITA: ${error.message}` });
    }
  }

  // UNAUTHORIZED ENDPOINT
  async getLastDetakJantungPenderita(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username,
        keluarga_username } = req.params;

      const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('Penderita Account has not been connected to Keluarga Account');
      }

      const riwayat = await this.riwayatDetakJantungService.getLastDetakJantungPenderita(
        penderita_username
      )
      logger.info(`Last DETAK JANTUNG for PENDERITA: ${penderita_username} has been found`);
        res.status(200).json({
            message: `Last DETAK JANTUNG for PENDERITA: ${penderita_username} has been found`,
            data:riwayat, 
        });
    } catch (error: any) {
      logger.error({ message: `Failed to get Last DETAK JANTUNG: ${error.message}` })
      res.status(500).json({ message: `Failed to get Last DETAK JANTUNG: ${error.message}` });
    }
  }

}

export default RiwayatDetakJantungController;