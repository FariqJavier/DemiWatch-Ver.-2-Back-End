import RiwayatDetakJantung from '../models/riwayatDetakJantung.model';
import DetakJantung from '../models/detakJantung.model';
import PenderitaService from './penderita.service';
import { Op } from 'sequelize';
import moment from 'moment-timezone';

function convertUTCTimeToTimeZone(utcTimestamp: Date, userTimeZone: string): Date {
    return moment.utc(utcTimestamp).tz(userTimeZone).toDate();
  }

class RiwayatDetakJantungService {

  constructor(
    private readonly penderitaService: PenderitaService,
  ) {} // Receives service as an argument

  async createNewRiwayatDetakJantung(data: {
    riwayat_detak_jantung_id: string;
    penderita_id: string;
  }): Promise<RiwayatDetakJantung> {
    try {
      const detakJantung = await RiwayatDetakJantung.create(data);
      return detakJantung;
    } catch (error) {
      throw new Error(`Failed to create new Riwayat Detak Jantung: ${error}`);
    }
  }

  async createNewDetakJantung(data: {
    detak_jantung_id: string;
    riwayat_detak_jantung_id: string;
    bpm_terakhir: Int16Array
  }): Promise<DetakJantung> {
    try {
      const detakJantung = await DetakJantung.create(data);
      return detakJantung;
    } catch (error) {
      throw new Error(`Failed to create Detak Jantung: ${error}`);
    }
  }

  async getRiwayatDetakJantungByPenderitaUsername(username: string): Promise<RiwayatDetakJantung | null> {
    try { 
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }
        const riwayatDetakJantung = await RiwayatDetakJantung.findOne({
            where: { penderita_id: penderita.penderita_id },
        });
        return riwayatDetakJantung
    } catch (error) {
      throw new Error(`Failed to get Riwayat Detak Jantung Penderita: ${error}`);
    }
  }

  async getLastDetakJantungPenderita(username: string): Promise<DetakJantung | null> {
    try { 
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }
        const riwayatDetakJantung = await RiwayatDetakJantung.findOne({
          where: { penderita_id: penderita.penderita_id }
        })
        if (!riwayatDetakJantung) {
          throw new Error('Riwayat Detak Jantung not found');
        }
        const lastDetakJantung = await DetakJantung.findOne({
            where: { riwayat_detak_jantung_id: riwayatDetakJantung.riwayat_detak_jantung_id },
            order: [['timestamp', 'DESC']] // Assuming 'createdAt' is the timestamp field
        });
        return lastDetakJantung
    } catch (error) {
      throw new Error(`Failed to get Last Detak Jantung Penderita: ${error}`);
    }
  }

  async getLastDayDetakJantungPenderita(username: string): Promise<any | null> {
    try {
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }
        const riwayatDetakJantung = await RiwayatDetakJantung.findOne({
          where: { penderita_id: penderita.penderita_id }
        })
        if (!riwayatDetakJantung) {
          throw new Error('Riwayat Detak Jantung not found');
        }
        const lastDetakJantung = await this.getLastDetakJantungPenderita(username);
        // Check if lastDetakJantung exists
        if (!lastDetakJantung) {
          return null;
        }

        const lastTimestamp = lastDetakJantung.timestamp;

        // Calculate the start of the last day period (24 hours back from lastTimestamp)
        const startOfLastDay = moment(lastTimestamp).subtract(1, 'days').toDate();

        const detakJantung = await DetakJantung.findAll({
            where: {
                riwayat_detak_jantung_id: riwayatDetakJantung.riwayat_detak_jantung_id,
                timestamp: {
                  [Op.gte]: startOfLastDay,
                  [Op.lt]: lastTimestamp,
                },
              },
              order: [['timestamp', 'DESC']],
        })

        const detakJantungWIB = detakJantung.map((detak) => {
            const userTimeZone = 'Asia/Jakarta'; // Assuming you have a function to get user's time zone
            const userTimestamp = convertUTCTimeToTimeZone(detak.timestamp, userTimeZone);
            return {
                detak_jantung_id: detak.detak_jantung_id,
                riwayat_detak_jantung_id: detak.riwayat_detak_jantung_id,
                bpm_terakhir: detak.bpm_terakhir,
                timestamp: userTimestamp, // Use userTimestamp instead of timestamp
                // _attributes: detak._attributes,
                // dataValues: detak.dataValues,
                // _creationAttributes: detak._creationAttributes,
                // isNewRecord: detak.isNewRecord,
                // sequelize: detak.sequelize,
                // _model: detak._model,
              };
        });
          
        return detakJantungWIB
    } catch (error) {
      throw new Error(`Failed to get Last Day Detak Jantung Penderita: ${error}`);
    }
  }

}

export default RiwayatDetakJantungService;