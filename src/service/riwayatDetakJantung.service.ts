import RiwayatDetakJantung from '../models/riwayatDetakJantung.model';
import DetakJantung from '../models/detakJantung.model';
import PenderitaService from './penderita.service';
import DetailPenderitaService from './detailPenderita.service';
import { Op } from 'sequelize';
import moment from 'moment-timezone';
import logger from "../utils/logger";

function convertUTCTimeToTimeZone(utcTimestamp: Date, userTimeZone: string): Date {
    return moment.utc(utcTimestamp).tz(userTimeZone).toDate();
  }

function ageCalculation(tanggalLahir: Date): number {
  const today = moment();
  const birthDate = moment(tanggalLahir);

  if (!birthDate.isValid()) {
    throw new Error('Invalid date format');
  }

  let usia = today.diff(birthDate, 'years');
  const bulan = today.month() - birthDate.month();
  const hari = today.date() - birthDate.date();
  if (bulan < 0 || (bulan === 0 && hari < 0)) {
    usia--;
  }

  return usia;
}

function normalBPMRange(usia: number): [number, number] {
  if (usia >= 1 && usia <= 3) {
      return [80, 130];
  } else if (usia >= 3 && usia <= 4) {
      return [80, 120];
  } else if (usia >= 6 && usia <= 10) {
      return [70, 110];
  } else if (usia >= 11 && usia <= 14) {
      return [60, 105];
  } else if (usia >= 15 && usia < 20) {
      return [60, 100];
  } else if (usia >= 20 && usia <= 35) {
      return [95, 170];
  } else if (usia > 35 && usia <= 50) {
      return [85, 155];
  } else if (usia >= 60) {
      return [80, 130];
  } else {
      return [60, 100]; // Default rentang untuk usia di luar rentang yang diberikan
  }
}


class RiwayatDetakJantungService {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly detailPenderitaService: DetailPenderitaService,
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

  async getLastTenMinutesDetakJantungPenderita(username: string): Promise< (number) > {
    try {
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username);
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
          throw new Error('Last Detak Jantung not found');
        }

        const lastTimestamp = lastDetakJantung.timestamp;

        // Calculate the start of the last 10 minutes period (10 minutes back from lastTimestamp)
        const startOfTenMinutesEarlier = moment(lastTimestamp).subtract(10, 'minutes').toDate();

        const detakJantung = await DetakJantung.findAll({
            where: {
                riwayat_detak_jantung_id: riwayatDetakJantung.riwayat_detak_jantung_id,
                timestamp: {
                  [Op.gte]: startOfTenMinutesEarlier,
                  [Op.lt]: lastTimestamp,
                },
              },
              order: [['timestamp', 'DESC']],
        })

        if (detakJantung.length === 0) {
          throw new Error('Tidak ada data detak jantung dalam 10 menit terakhir.');
      }
  
      const totalBPM = detakJantung.reduce((sum, record) => sum + Number(record.bpm_terakhir), 0);
      const rataRataBPM = totalBPM / detakJantung.length;
          
      return rataRataBPM;
    } catch (error) {
      throw new Error(`Failed to get Last Ten Minutes Detak Jantung Penderita: ${error}`);
    }
  }

  async CheckForLastTenMinutesDetakJantungPenderitaSOS(username:string, rataRataBPM: number): Promise< (boolean) > {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username);
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }

        const detailPenderita = await this.detailPenderitaService.getDetailPenderitaByPenderitaUsername(username);
        if (!detailPenderita) {
          throw new Error('Detail Penderita Account not found');
        }

        const usiaPenderita = ageCalculation(detailPenderita.tanggal_lahir);
        logger.info(`Usie Penderita ${username}: ${usiaPenderita} tahun`)
        const rangeBPMNormalPenderita = normalBPMRange(usiaPenderita);
        logger.info(`Range Normal BPM Penderita ${username}: ${rangeBPMNormalPenderita[0]} - ${rangeBPMNormalPenderita[1]} BPM`)
    
      if (!rataRataBPM) {
        return false
      }
        
      const detakJantungSOS = !(rataRataBPM >= rangeBPMNormalPenderita[0] && rataRataBPM <= rangeBPMNormalPenderita[1])
          
      return detakJantungSOS
    } catch (error) {
      throw new Error(`Failed to Check Last Ten Minutes Detak Jantung Penderita SOS: ${error}`);
    }
  }

  async updateRiwayatDetakJantungStatus(username: string, data: {
    status: string;
  }): Promise<[number, RiwayatDetakJantung[]]> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      if (!penderita) {
        throw new Error('Penderita not found');
      }
      const riwayatDetakJantung = await RiwayatDetakJantung.findOne({
        where: { penderita_id: penderita.penderita_id }
      })
      if (!riwayatDetakJantung) {
        throw new Error('Riwayat Detak Jantung not found');
      }
      const [updatedRows, updatedRiwayat] = await RiwayatDetakJantung.update(data, {
        where: { 
          riwayat_detak_jantung_id: riwayatDetakJantung.riwayat_detak_jantung_id,
         },
        returning: true,
      });
      return [updatedRows, updatedRiwayat];
    } catch (error) {
      throw new Error(`Failed to update Status Riwayat Detak Jantung Penderita: ${error}`);
    }
  }

}

export default RiwayatDetakJantungService;