import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import PenderitaService from '../service/penderita.service';
import HubunganPenderitaService from '../service/hubunganPenderita.service';
import RiwayatDetakJantungService from '../service/riwayatDetakJantung.service';
import EmergensiService from '../service/emergensi.service';

class RiwayatDetakJantungController {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly hubunganPenderitaService: HubunganPenderitaService,
    private readonly riwayatDetakJantungService : RiwayatDetakJantungService,
    private readonly emergencyService : EmergensiService,
  ) {} // Receives service as an argument

  // UNAUTHORIZED ENDPOINT
  async createNewDetakJantungOrEmergensi(req: Request, res: Response): Promise<void> {
    try {    
        var detakJantungUUID = uuidv4();
        var emergensiUUID = uuidv4();

        const { 
          penderita_username } = req.params;

        const { 
            bpm_terakhir } = req.body;

        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username);
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }

        const riwayatDetakJantung = await this.riwayatDetakJantungService.getRiwayatDetakJantungByPenderitaUsername(penderita_username);
        // Check if the riwayat detak jantung was found
        if (!riwayatDetakJantung) {
          throw new Error('Riwayat Detak Jantung not found');
        }

        const riwayat = await this.riwayatDetakJantungService.createNewDetakJantung({
          detak_jantung_id: detakJantungUUID,
          riwayat_detak_jantung_id: riwayatDetakJantung.riwayat_detak_jantung_id,
          bpm_terakhir
        })
        logger.info(`New DETAK JANTUNG created succesfully`);

        const rataRataBPMTenMinutes = await this.riwayatDetakJantungService.getLastTenMinutesDetakJantungPenderita(penderita_username);
        logger.info(`DETAK JANTUNG Rata-rata for 10 minutes: ${rataRataBPMTenMinutes} for PENDERITA ${penderita_username}`);
        
        const checkDetakJantungSOS = await this.riwayatDetakJantungService.CheckForLastTenMinutesDetakJantungPenderitaSOS(penderita_username, rataRataBPMTenMinutes)
        logger.info(`DETAK JANTUNG SOS: ${checkDetakJantungSOS} for PENDERITA ${penderita_username}`);

        if (checkDetakJantungSOS) {
          const [updatedRows, updatedStatusRiwayat] = await this.riwayatDetakJantungService.updateRiwayatDetakJantungStatus(penderita_username, {
            status: "ABNORMAL"
          })
          if (!updatedStatusRiwayat) {
            logger.error({ message: 'PENDERITA Account not found' })
            res.status(404).json({ message: 'PENDERITA Account not found' });
            return;
          }
          if (updatedRows === 0) {
            logger.error({ message: 'PENDERITA Account not found' })
            res.status(404).json({ message: 'PENDERITA Account not found' });
            return;
          }
          logger.info(`Status RIWAYAT DETAK JANTUNG PENDERITA: ${penderita_username} has been updated to ABNORMAL`);

          const detakJantungSOS = await this.emergencyService.createNewAutomatedEmergensi({
            emergensi_id: emergensiUUID,
            penderita_id: penderita.penderita_id,
            bpm_sepuluh_menit_terakhir: rataRataBPMTenMinutes,
            jarak_tersesat: null,
            emergensi_button: null,
            nilai_accelerometer: null,
          })
          logger.info(`EMERGENCY! PENDERITA ${penderita_username} has abnormal BPM`);
          res.status(201).json({
            message: `EMERGENCY! PENDERITA ${penderita_username} has abnormal BPM`,
            data: detakJantungSOS
          })
          return;
        }

        res.status(201).json({
          message: `New DETAK JANTUNG for PENDERITA ${penderita_username} created successfully`,
          data: riwayat 
        })
    } catch (error: any) {
      logger.error({ message: `Failed to create New DETAK JANTUNG for PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to create New DETAK JANTUNG for PENDERITA: ${error.message}` });
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