import LokasiAwal from '../models/lokasiAwal.model';
import LokasiTerakhir from '../models/lokasiTerakhir.model';
import LokasiTujuan from '../models/lokasiTujuan.model';
import RiwayatPerjalanan from '../models/riwayatPerjalanan.model';
import PenderitaService from './penderita.service';

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// rumus haversine dalam meter
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius bumi dalam kilometer

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance * 1000; // Konversi kilometer ke meter
}

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

  async getLokasiTerakhirByRiwayatperjalananIdTanpaLimit(id: string): Promise<LokasiTerakhir| null> {
    try { 
      const lokasi = await LokasiTerakhir.findOne({
        where: { riwayat_perjalanan_id: id },
        order: [['timestamp', 'DESC']], // Order by timestamp in descending order
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

  async getLokasiTerakhirByPenderitaUsername(username: string): Promise<LokasiTerakhir[] | null> {
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
      const lokasi = await this.getLokasiTerakhirByRiwayatperjalananId(riwayat.riwayat_perjalanan_id, 1)
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

  async getRiwayatPerjalananPenderitaTerakhir(username: string): Promise<RiwayatPerjalanan | null> {
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

  async getKelompokLokasiByLastRiwayatPerjalananPenderita(username: string): Promise<any> {
    try {
      const riwayatPerjalanan = await this.getRiwayatPerjalananPenderitaTerakhir(username)
      if (!riwayatPerjalanan) {
        throw new Error('Riwayat Perjalanan not found');
      }
      const lokasiAwal = await this.getAllLokasiAwalByRiwayatPerjalananId(riwayatPerjalanan.riwayat_perjalanan_id)
      const lokasiTerakhir = await this.getLokasiTerakhirByRiwayatperjalananId(riwayatPerjalanan.riwayat_perjalanan_id, 1)
      const lokasiTujuan = await this.getAllLokasiTujuanByRiwayatPerjalananId(riwayatPerjalanan.riwayat_perjalanan_id)

      return {
        lokasiAwal,
        lokasiTerakhir,
        lokasiTujuan
      }
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
      const lokasiTerakhir = await this.getLokasiTerakhirByRiwayatperjalananId(riwayat_perjalanan_id, 1)
      const lokasiTujuan = await this.getAllLokasiTujuanByRiwayatPerjalananId(riwayat_perjalanan_id)

      return {
        lokasiAwal,
        lokasiTerakhir,
        lokasiTujuan
      }
    } catch (error) {
      throw new Error(`Failed to get Pengelompokan Lokasi by Every Riwayat Perjalanan Penderita: ${error}`);
    }
  }

  async getJarakLokasiTerakhirDenganLokasiAwal(username: string): Promise<number[]> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const riwayat = await this.getRiwayatPerjalananPenderitaTerakhir(username);
      // Check if the latest riwayat was found
      if (!riwayat) {
        throw new Error('Riwayat Perjalanan not found');
      }
      const lokasiAwal = await this.getAllLokasiAwalByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id);
      // Check if the all latest Lokasi Awal was found
      if (!lokasiAwal) {
        throw new Error('Lokasi Awal not found');
      }
      const lokasiTerakhir = await this.getLokasiTerakhirByRiwayatperjalananIdTanpaLimit(riwayat.riwayat_perjalanan_id);
      // Check if the latest Lokasi Terakhir was found
      if (!lokasiTerakhir) {
        throw new Error('Lokasi Terakhir not found');
      }

      // Rumus Haversine
      const semuaJarak = lokasiAwal.map((lokasi) => {
        return haversineDistance(
          Number(lokasi.latitude_awal),
          Number(lokasi.longitude_awal),
          Number(lokasiTerakhir.latitude_terakhir),
          Number(lokasiTerakhir.longitude_terakhir)
        )
      })

      return semuaJarak      
    } catch (error) {
      throw new Error(`Failed to get Jarak Antara Lokasi Awal dan Lokasi Terakhir: ${error}`);
    }
  }

  async getJarakLokasiTerakhirDenganLokasiTujuan(username: string): Promise<number[]> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const riwayat = await this.getRiwayatPerjalananPenderitaTerakhir(username);
      // Check if the latest riwayat was found
      if (!riwayat) {
        throw new Error('Riwayat Perjalanan not found');
      }
      const lokasiTujuan = await this.getAllLokasiTujuanByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id);
      // Check if the all latest Lokasi Awal was found
      if (!lokasiTujuan) {
        throw new Error('Lokasi Tujuan not found');
      }
      const lokasiTerakhir = await this.getLokasiTerakhirByRiwayatperjalananIdTanpaLimit(riwayat.riwayat_perjalanan_id);
      // Check if the latest Lokasi Terakhir was found
      if (!lokasiTerakhir) {
        throw new Error('Lokasi Terakhir not found');
      }

      // Rumus Haversine
      const semuaJarak = lokasiTujuan.map((lokasi) => {
        return haversineDistance(
          Number(lokasi.latitude_tujuan),
          Number(lokasi.longitude_tujuan),
          Number(lokasiTerakhir.latitude_terakhir),
          Number(lokasiTerakhir.longitude_terakhir)
        )
      })

      return semuaJarak      
    } catch (error) {
      throw new Error(`Failed to get Jarak Antara Lokasi Tujuan dan Lokasi Terakhir: ${error}`);
    }
  }

  async getJarakMaxLokasiAwalDenganLokasiTujuan(username: string): Promise<number> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const riwayat = await this.getRiwayatPerjalananPenderitaTerakhir(username);
      // Check if the latest riwayat was found
      if (!riwayat) {
        throw new Error('Riwayat Perjalanan not found');
      }
      const lokasiTujuan = await this.getAllLokasiTujuanByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id);
      // Check if the all latest Lokasi Awal was found
      if (!lokasiTujuan) {
        throw new Error('Lokasi Tujuan not found');
      }
      const lokasiAwal = await this.getAllLokasiAwalByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id);
      // Check if the all latest Lokasi Awal was found
      if (!lokasiAwal) {
        throw new Error('Lokasi Terakhir not found');
      }

      // Rumus Haversine
      const semuaJarakArr = lokasiTujuan.map((tujuan) => {
        return lokasiAwal.map((awal) => {
          return haversineDistance(
            Number(awal.latitude_awal),
            Number(awal.longitude_awal),
            Number(tujuan.latitude_tujuan),
            Number(tujuan.longitude_tujuan)
          )
        })
      })

      // Ratakan array dua dimensi menjadi array satu dimensi
      const semuaJarak = semuaJarakArr.flat();

      // Dapatkan nilai maksimum dan minimum
      const jarakMax = Math.max(...semuaJarak);

      return jarakMax     
    } catch (error) {
      throw new Error(`Failed to get Jarak Antara Semua Lokasi Awal dan Semua Lokasi Terakhir: ${error}`);
    }
  }

  async updateLokasiTujuanByLokasiTujuanId(username: string, riwayat_perjalanan_id: string, data: {
    alamat_tujuan: string | null;
    longitude_tujuan: Float32Array | null;
    latitude_tujuan: Float32Array | null;
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
      // Filter out null properties
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
      );
      const [updatedRows, updatedLokasi] = await LokasiTujuan.update(filteredData, {
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

  async updateRiwayatPerjalananPenderitaTerakhirStatus(username: string, data: {
    status: string;
  }): Promise<[number, RiwayatPerjalanan[]]> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      if (!penderita) {
        throw new Error('Penderita not found');
      }
      const riwayatPerjalanan = await this.getRiwayatPerjalananPenderitaTerakhir(username)
      if (!riwayatPerjalanan) {
        throw new Error('Riwayat Perjalanan not found');
      }
      const [updatedRows, updatedRiwayat] = await RiwayatPerjalanan.update(data, {
        where: { 
          riwayat_perjalanan_id: riwayatPerjalanan.riwayat_perjalanan_id
         },
        returning: true,
      });
      return [updatedRows, updatedRiwayat];
    } catch (error) {
      throw new Error(`Failed to update Latest Riwayat Perjalanan Penderita Status: ${error}`);
    }
  }
}

export default RiwayatPerjalananService;