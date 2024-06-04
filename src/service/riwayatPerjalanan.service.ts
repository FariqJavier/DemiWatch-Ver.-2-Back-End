import LokasiAwal from '../models/lokasiAwal.model';
import LokasiTerakhir from '../models/lokasiTerakhir.model';
import LokasiTujuan from '../models/lokasiTujuan.model';
import RiwayatPerjalanan from '../models/riwayatPerjalanan.model';
import PenderitaService from './penderita.service';

class RiwayatPerjalananService {

  constructor(
    private readonly penderitaService: PenderitaService,
  ) {} // Receives service as an argument

  async createRiwayatPerjalanan(data: {
    riwayat_perjalanan_id: string;
    penderita_id: string;
  }): Promise<RiwayatPerjalanan> {
    try {
      const riwayat = await RiwayatPerjalanan.create(data);
      return riwayat;
    } catch (error) {
      throw new Error(`Failed to create Riwayat Perjalanan: ${error}`);
    }
  }

  async createLokasiAwal(data: {
    lokasi_awal_id: string;
    riwayat_perjalanan_id: string;
    alamat_awal: string;
    longitude_awal: Float32Array;
    latitude_awal: Float32Array;
  }): Promise<LokasiAwal> {
    try {
      const riwayat = await LokasiAwal.create(data);
      return riwayat;
    } catch (error) {
      throw new Error(`Failed to create Lokasi Awal: ${error}`);
    }
  }

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

  async createLokasiTujuan(data: {
    lokasi_tujuan_id: string;
    riwayat_perjalanan_id: string;
    alamat_tujuan: string;
    longitude_tujuan: Float32Array;
    latitude_tujuan: Float32Array;
  }): Promise<LokasiTujuan> {
    try {
      const riwayat = await LokasiTujuan.create(data);
      return riwayat;
    } catch (error) {
      throw new Error(`Failed to create Lokasi Tujuan: ${error}`);
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

  async getAllLokasiAwalByRiwayatPerjalananId(id: string): Promise<LokasiAwal[] | null> {
    try {
      const lokasi = await LokasiAwal.findAll({
        where: { riwayat_perjalanan_id: id },
        order: [
          ['longitude_awal', 'DESC'],
          ['latitude_awal', 'DESC']
        ],      
      });
      return lokasi;
    } catch (error) {
      throw new Error(`Failed to get All Lokasi Awal By Riwayat Perjalanan Id: ${error}`);
    }
  }

  async getAllLokasiTujuanByRiwayatPerjalananId(id: string): Promise<LokasiTujuan[] | null> {
    try {
      const lokasi = await LokasiTujuan.findAll({
        where: { riwayat_perjalanan_id: id },
        order: [
          ['longitude_tujuan', 'DESC'],
          ['latitude_tujuan', 'DESC']
        ],      
      });
      return lokasi;
    } catch (error) {
      throw new Error(`Failed to get All Lokasi Tujuan By Riwayat Perjalanan Id: ${error}`);
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
      // Check if the latest riwayat was found
      if (!riwayat) {
        throw new Error('Riwayat Perjalanan not found');
      }
      const lokasi = await this.getLokasiTerakhirByRiwayatperjalananId(riwayat.riwayat_perjalanan_id, 5)
      return lokasi;
    } catch (error) {
      throw new Error(`Failed to Five Lokasi Terakhir Penderita By Penderita Username: ${error}`);
    }
  }

  async getAllRiwayatPerjalananByPenderitaUsername(username: string): Promise<RiwayatPerjalanan[] | null> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const riwayat = await RiwayatPerjalanan.findAll({
        where: { penderita_id: penderita.penderita_id }
      });
      return riwayat;
    } catch (error) {
      throw new Error(`Failed to get All Riwayat Perjalanan by Penderita Username: ${error}`);
    }
  }

  async getRiwayatPerjalananByRiwayatPerjalananId(id: string): Promise<RiwayatPerjalanan | null> {
    try {
      const riwayat = await RiwayatPerjalanan.findOne({
        where: { riwayat_perjalanan_id: id }
      });
      return riwayat;
    } catch (error) {
      throw new Error(`Failed to get Riwayat Perjalanan by Riwayat Perjalanan Id: ${error}`);
    }
  }

  async getKelompokLokasiByEveryRiwayatPerjalananPenderita(username: string): Promise<any> {
    try {
      const riwayatPerjalanan = await this.getAllRiwayatPerjalananByPenderitaUsername(username)
      if (!riwayatPerjalanan) {
        throw new Error('Riwayat Perjalanan not found');
      }
      const groupedLokasi = await Promise.all(
        riwayatPerjalanan.map(async (riwayat) => {
          const lokasiAwal = await this.getAllLokasiAwalByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id)

          const lokasiTujuan = await this.getAllLokasiTujuanByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id)

          return {
            riwayatPerjalanan: riwayat,
            lokasiAwal: lokasiAwal,
            lokasiTujuan: lokasiTujuan,
          };
        })
      );

      return groupedLokasi;
    } catch (error) {
      throw new Error(`Failed to get Pengelompokan Lokasi by Every Riwayat Perjalanan Penderita: ${error}`);
    }
  }

  async getKelompokLokasiBySpecificRiwayatPerjalananPenderita(username: string, riwayat_perjalanan_id: string): Promise<any> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const riwayatPerjalanan = await this.getRiwayatPerjalananByRiwayatPerjalananId(riwayat_perjalanan_id)
      if (!riwayatPerjalanan) {
        throw new Error('Riwayat Perjalanan not found');
      }
      if(riwayatPerjalanan.penderita_id!=penderita.penderita_id){
        throw new Error('Riwayat Perjalanan is not from Current Penderita');
      }
      const lokasiAwal = await this.getAllLokasiAwalByRiwayatPerjalananId(riwayat_perjalanan_id)
      const lokasiTujuan = await this.getAllLokasiTujuanByRiwayatPerjalananId(riwayat_perjalanan_id)

      return {
        lokasiAwal,
        lokasiTujuan
      }
    } catch (error) {
      throw new Error(`Failed to get Pengelompokan Lokasi by Every Riwayat Perjalanan Penderita: ${error}`);
    }
  }

  async updateLokasiTujuanByLokasiTujuanId(username: string, riwayat_perjalanan_id: string, data: {
    alamat_tujuan: string;
    longitude_tujuan: Float32Array;
    latitude_tujuan: Float32Array;
  }): Promise<[number, LokasiTujuan[]]> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      if (!penderita) {
        throw new Error('Penderita not found');
      }
      const riwayatPerjalanan = await this.getRiwayatPerjalananByRiwayatPerjalananId(riwayat_perjalanan_id)
      if (!riwayatPerjalanan) {
        throw new Error('Riwayat Perjalanan not found');
      }
      const [updatedRows, updatedLokasi] = await LokasiTujuan.update(data, {
        where: { 
          riwayat_perjalanan_id: riwayat_perjalanan_id
         },
        returning: true,
      });
      return [updatedRows, updatedLokasi];
    } catch (error) {
      throw new Error(`Failed to update Lokasi Tujuan: ${error}`);
    }
  }
}

export default RiwayatPerjalananService;