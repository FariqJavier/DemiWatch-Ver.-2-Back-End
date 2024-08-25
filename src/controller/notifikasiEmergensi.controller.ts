import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import PenderitaService from '../service/penderita.service';
import EmergensiService from '../service/emergensi.service';
import NotifikasiService from '../service/notifikasi.service';

function sendPushNotification(fcmToken: any, title: any, message: any) {
  const messagePayload = {
    notification: {
      title: title,
      body: message
    },
    token: fcmToken
  };

  admin.messaging().send(messagePayload)
    .then((response: Response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error: any) => {
      console.log('Error sending message:', error);
    });
}

class NotifikasiEmergensiController {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly emergensiService : EmergensiService,
    private readonly notifikasiService : NotifikasiService,
  ) {} // Receives service as an argument

  async createNewEmergensiByEmergencyButton(req: Request, res: Response): Promise<void> {
    try {
        var emergensiUUID = uuidv4();
        var notifikasiUUID = uuidv4();

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

        const fcmToken = 'cqS6joMIQNaDNQbewC6y-x:APA91bGdzJxWOVeu_x5r_0OqOZTr_V5otOT-Qj5LfvLGZFmOO_6KoCDmOrmsnXhJT3kIFie_iK8ZHwJDi1aSTNnZXM6QYNENNnztS9oRObEUjq5Yskcpei_qReRgdIzta175PBO78OCi'
        const title = 'TRIGGERED EMERGENSI BUTTON'
        const message = `EMERGENCY! PENDERITA ${penderita_username} is MENEKAN EMERGENSI BUTTON`
        
        sendPushNotification(fcmToken, title, message);

        const notifikasi = await this.notifikasiService.createNewNotifikasi(penderita_username, {
          notifikasi_id: notifikasiUUID,
          emergensi_id: emergensiUUID,
          tipe: title,
          pesan: message,
          timestamp: emergensi.timestamp
        })
        logger.info(`NOTIFIKASI has Successfully created`);

        res.status(201).json({
          message: `EMERGENCY! PENDERITA ${penderita_username} is MENEKAN EMERGENSI BUTTON`,
          data: {
            notifikasi: notifikasi,
            emergensi: emergensi
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
        var notifikasiUUID = uuidv4();

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

        const fcmToken = 'cqS6joMIQNaDNQbewC6y-x:APA91bGdzJxWOVeu_x5r_0OqOZTr_V5otOT-Qj5LfvLGZFmOO_6KoCDmOrmsnXhJT3kIFie_iK8ZHwJDi1aSTNnZXM6QYNENNnztS9oRObEUjq5Yskcpei_qReRgdIzta175PBO78OCi'
        const title = 'ABNORMAL NILAI ACCELEROMETER'
        const message = `EMERGENCY! PENDERITA ${penderita_username} has ABNORMAL NILAI ACCELEROMETER`
        
        sendPushNotification(fcmToken, title, message);

        const notifikasi = await this.notifikasiService.createNewNotifikasi(penderita_username, {
          notifikasi_id: notifikasiUUID,
          emergensi_id: emergensiUUID,
          tipe: title,
          pesan: message,
          timestamp: emergensi.timestamp
        })
        logger.info(`NOTIFIKASI has Successfully created`);

        res.status(201).json({
          message: `EMERGENCY! PENDERITA ${penderita_username} has ABNORMAL NILAI ACCELEROMETER`,
          data: {
            notifikasi: notifikasi,
            emergensi: emergensi
          }
        })
    } catch (error: any) {
      logger.error({ message: `Failed to create New EMERGENSI BY ABNORMAL NILAI ACCELEROMETER: ${error.message}` })
      res.status(500).json({ message: `Failed to create New EMERGENSI BY ABNORMAL NILAI ACCELEROMETER: ${error.message}` });
    }
  }

}

export default NotifikasiEmergensiController;