import LokasiTerakhir from '../models/lokasiTerakhir.model';
import RiwayatPerjalanan from '../models/riwayatPerjalanan.model';
import PenderitaService from './penderita.service';
import { Op } from 'sequelize';

class LokasiTerakhirService {

  constructor(
    private readonly penderitaService: PenderitaService,
  ) {} // Receives service as an argument

  async createLokasiTerakhir(data: {
    lokasi_terakhir_id: string;
    riwayat_perjalanan_id: string;
    longitude_terakhir: Float32Array;
    latitude_terakhir: Float32Array;
  }): Promise<LokasiTerakhir> {
    try {
      const lokasi = await LokasiTerakhir.create(data);
      return lokasi;
    } catch (error) {
      throw new Error(`Failed to create Lokasi Terakhir: ${error}`);
    }
  }

  async getLokasiTerakhirByRiwayatperjalananId(id: string, limit: number): Promise<LokasiTerakhir[]| null> {
    try { 
      const lokasi = await LokasiTerakhir.findAll({
        where: { riwayat_perjalanan_id: id },
        order: [['timestamp', 'DESC']], // Order by timestamp in descending order
        limit: limit,
      });
      return lokasi;
    } catch (error) {
      throw new Error(`Failed to get Lokasi Terakhir Penderita ID: ${error}`);
    }
  }


  async getLimaLokasiTerakhirByPenderitaUsername(username: string): Promise<LokasiTerakhir[] | null> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const riwayat = await RiwayatPerjalanan.findOne({
        where: { penderita_id: penderita.penderita_id },
        order: [['created_at', 'DESC']],
      })
      const lokasi = await this.getLimaLokasiTerakhirByPenderitaUsername()
      return lokasi;
    } catch (error) {
      throw new Error(`Failed to Five Lokasi Terakhir Penderita By Penderita Username: ${error}`);
    }
  }

  async deleteLokasiTerakhirbyRangeTimestamp(start_timestamp: Date, end_timestamp: Date): Promise<number> {
    try {
      const deletedRows = await LokasiTerakhir.destroy({
        where: {
          timestamp: {
            [Op.between]: [start_timestamp, end_timestamp],
          },
        },
      });
      return deletedRows
    } catch (error) {
      throw new Error(`Failed to delete Lokasi Terakhir in the Timestamp Range: ${error}`);
    }
  }
}

export default LokasiTerakhirService;