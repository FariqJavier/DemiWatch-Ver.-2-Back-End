import Notifikasi from '../models/notifikasi.model'
import PenderitaService from './penderita.service';
import HubunganPenderitaService from './hubunganPenderita.service';
import moment from 'moment-timezone';
import logger from "../utils/logger";

function convertUTCTimeToTimeZone(utcTimestamp: Date, userTimeZone: string): Date {
    return moment.utc(utcTimestamp).tz(userTimeZone).toDate();
  }

class NotifikasiService {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly hubunganService: HubunganPenderitaService,
  ) {} // Receives service as an argument

  async createNewNotifikasi(penderita_username: string, data: {
    notifikasi_id: string;
    emergensi_id: string;
    tipe: string;
    pesan: string;
    timestamp: Date;
  }): Promise<Notifikasi[]> {
    try {
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }
        const keluargaList = await this.hubunganService.getDetailKeluargaByPenderitaUsername(penderita_username)
        // Check if the all keluarga was found
        if (!keluargaList) {
          throw new Error('Keluarga Detail related to Penderita not found');
        }
        if (keluargaList.length === 0) {
          throw new Error('Keluarga Detail related to Penderita not found');
        }

        const userTimeZone = 'Asia/Jakarta'; // Assuming you have a function to get user's time zone
        const userTimestamp = convertUTCTimeToTimeZone(data.timestamp, userTimeZone);

        const newData = keluargaList.map((keluarga) => {
            return {
                notifikasi_id: data.notifikasi_id,
                keluarga_id: keluarga.keluarga_id,
                penderita_id: penderita.penderita_id,
                emergensi_id: data.emergensi_id,
                tipe: data.tipe,
                pesan: data.pesan,
                timestamp: userTimestamp,
            }
        });
        const notifikasiPromises = newData.map((Data) => {
            return Notifikasi.create(Data);
        });
        const notifikasi = await Promise.all(notifikasiPromises);

        return notifikasi;
    } catch (error) {
      throw new Error(`Failed to create new Automated Emergensi: ${error}`);
    }
  }

}

export default NotifikasiService;