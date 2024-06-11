import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import PenderitaService from '../service/penderita.service';
import EmergensiService from '../service/emergensi.service';

class EmergensiController {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly emergensiService : EmergensiService,
  ) {} // Receives service as an argument

  async createNewEmergensiByEmergencyButton(req: Request, res: Response): Promise<void> {
    try {
        var emergensiUUID = uuidv4();

        const { 
          penderita_username } = req.params;

        const { 
          emergensi_button } = req.body;

        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }

        const emergensi = await this.emergensiService.createNewManualEmergensi(penderita_username, {
            emergensi_id: emergensiUUID,
            bpm_sepuluh_menit_terakhir: null,
            jarak_tersesat: null,
            emergensi_button: emergensi_button,
            nilai_accelerometer: null,
        })
        logger.info(`EMERGENCY! PENDERITA ${penderita_username} is MENEKAN EMERGENSI BUTTON`);

        res.status(201).json({
          message: `EMERGENCY! PENDERITA ${penderita_username} is MENEKAN EMERGENSI BUTTON`,
          data: {
            emergensi,
          }
        })
    } catch (error: any) {
      logger.error({ message: `Failed to create New EMERGENSI BY EMERGENSI BUTTON: ${error.message}` })
      res.status(500).json({ message: `Failed to create New EMERGENSI BY EMERGENSI BUTTON: ${error.message}` });
    }
  }

  async createNewEmergensiByNilaiAccelerometer(req: Request, res: Response): Promise<void> {
    try {
        var emergensiUUID = uuidv4();

        const { 
          penderita_username } = req.params;

        const { 
          nilai_accelerometer } = req.body;

        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }

        const emergensi = await this.emergensiService.createNewManualEmergensi(penderita_username, {
            emergensi_id: emergensiUUID,
            bpm_sepuluh_menit_terakhir: null,
            jarak_tersesat: null,
            emergensi_button: null,
            nilai_accelerometer: nilai_accelerometer,
        })
        logger.info(`EMERGENCY! PENDERITA ${penderita_username} has ABNORMAL NILAI ACCELEROMETER`);

        res.status(201).json({
          message: `EMERGENCY! PENDERITA ${penderita_username} has ABNORMAL NILAI ACCELEROMETER`,
          data: {
            emergensi,
          }
        })
    } catch (error: any) {
      logger.error({ message: `Failed to create New EMERGENSI BY ABNORMAL NILAI ACCELEROMETER: ${error.message}` })
      res.status(500).json({ message: `Failed to create New EMERGENSI BY ABNORMAL NILAI ACCELEROMETER: ${error.message}` });
    }
  }

}

export default EmergensiController;