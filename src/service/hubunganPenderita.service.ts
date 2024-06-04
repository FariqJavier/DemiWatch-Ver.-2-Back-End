import HubunganPenderita from '../models/hubunganPenderita.model';
import KeluargaService from './keluarga.service';
import PenderitaService from './penderita.service';
import DetailPenderita from '../models/detailPenderita.model';
import DetailPenderitaService from './detailPenderita.service';
import { normalizeString } from '../utils/normalize';
import DetailKeluarga from '../models/detailKeluarga.model';
import DetailKeluargaService from './detailKeluarga.service';

class HubunganPenderitaService {

  constructor(
    private readonly keluargaService: KeluargaService,
    private readonly penderitaService: PenderitaService,
    private readonly detailPenderitaService: DetailPenderitaService,
    private readonly detailKeluargaService: DetailKeluargaService,
  ) {} // Receives service as an argument

  async createHubunganPenderitaByPenderitaData(keluarga_username: string, data: {
    penderita_username: string;
  }): Promise<HubunganPenderita> {
    try {
      const keluarga = await this.keluargaService.getKeluargaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!keluarga) {
        throw new Error('KELUARGA Account not found');
      }
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(data.penderita_username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('PENDERITA Account not found');
      }
      const dataHubungan = {
        penderita_id: penderita.penderita_id,
        keluarga_id: keluarga.keluarga_id
      }
      const hubungan = await HubunganPenderita.create(dataHubungan);
      return hubungan;
    } catch (error) {
      throw new Error(`Failed to create HUBUNGAN PENDERITA KELUARGA: ${error}`);
    }
  }

  async createHubunganPenderitaByPenderitaUsername(keluarga_username: string, penderita_username: string): Promise<HubunganPenderita> {
    try {
      const keluarga = await this.keluargaService.getKeluargaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!keluarga) {
        throw new Error('KELUARGA Account not found');
      }
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('PENDERITA Account not found');
      }

      const dataHubungan = {
        penderita_id: penderita.penderita_id,
        keluarga_id: keluarga.keluarga_id
      }
      const hubungan = await HubunganPenderita.create(dataHubungan);

      return hubungan;
    } catch (error) {
      throw new Error(`Failed to create HUBUNGAN PENDERITA KELUARGA: ${error}`);
    }
  }

  async getAllPenderitaByImperfectDetailPenderitaData(keluarga_username: string, data: {
    penderita_nama: string;
    penderita_alamat_rumah: string;
    penderita_tanggal_lahir: Date;
    penderita_gender: 'Laki-laki' | 'Perempuan'
  }): Promise<DetailPenderita[]> {
    try {
      const keluarga = await this.keluargaService.getKeluargaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!keluarga) {
        throw new Error('KELUARGA Account not found');
      }
      const penderitaList = await this.detailPenderitaService.getDetailPenderitaByImperfectDetailPenderitaData({
        nama: data.penderita_nama,
        alamat_rumah: data.penderita_alamat_rumah,
        tanggal_lahir: data.penderita_tanggal_lahir,
        gender: data.penderita_gender
      })

      if (!penderitaList) {
        throw new Error('PENDERITA Account not found');
      }

      if (penderitaList.length < 1) {
        throw new Error('PENDERITA Account not found');
      }

      return penderitaList;
    } catch (error) {
      throw new Error(`Failed to get All PENDERITA Account: ${error}`);
    }
  }

  async getHubunganPenderitaByPenderitaId(id: string): Promise<HubunganPenderita[] | null> {
    try {
      const hubungan = await HubunganPenderita.findAll({
        where: {penderita_id: id},
        attributes: ['penderita_id', 'keluarga_id'] 
      })
      return hubungan;
    } catch (error) {
      throw new Error(`Failed to get HUBUNGAN PENDERITA By PENDERITA ID ${error}`);
    }
  }

  async getHubunganPenderitaByKeluargaId(id: string): Promise<HubunganPenderita[] | null> {
    try {
      const hubungan = await HubunganPenderita.findAll({
        where: {keluarga_id: id},
        attributes: ['penderita_id', 'keluarga_id'] 
      })
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('KELUARGA Account has not been connected to any PENDERITA Account');
      }
      return hubungan;
    } catch (error) {
      throw new Error(`Failed to get HUBUNGAN PENDERITA By KELUARGA ID ${error}`);
    }
  }

  async getHubunganPenderitaByKeluargaUsername(username: string): Promise<HubunganPenderita[] | null> {
    try {
      const keluarga = await this.keluargaService.getKeluargaByKeluargaUsername(username)
      // Check if the penderita was found
      if (!keluarga) {
        throw new Error('KELUARGA Account has not found');
      }
      const hubungan = await HubunganPenderita.findAll({
        where: {keluarga_id: keluarga.keluarga_id},
        attributes: ['penderita_id', 'keluarga_id'] 
      })
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('KELUARGA Account has not been connected to any PENDERITA Account');
      }
      return hubungan;
    } catch (error) {
      throw new Error(`Failed to get HUBUNGAN PENDERITA By KELUARGA ID ${error}`);
    }
  }

  async getDetailKeluargaByPenderitaUsername(username: string): Promise<DetailKeluarga[]> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('PENDERITA Account not found');
      }
      const hubungan = await this.getHubunganPenderitaByPenderitaId(penderita.penderita_id)
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('PENDERITA Account has not been connected to any KELUARGA Account');
      }
      const detailKeluargaList: DetailKeluarga[] = [];
      for (const hubunganPenderita of hubungan) {
        const detailKeluarga = await this.detailKeluargaService.getDetailKeluargaByKeluargaId(hubunganPenderita.keluarga_id);
        if (detailKeluarga !== null) {
          detailKeluargaList.push(detailKeluarga);
        }
      }
      return detailKeluargaList;
    } catch (error) {
      throw new Error(`Failed to get DETAIL KELUARGA by PENDERITA Username ${error}`);
    }
  }

  async getDetailPenderitaByKeluargaUsername(username: string): Promise<DetailPenderita[]> {
    try {
      const keluarga = await this.keluargaService.getKeluargaByKeluargaUsername(username)
      // Check if the keluarga was found
      if (!keluarga) {
        throw new Error('KELUARGA Account not found');
      }
      const hubungan = await this.getHubunganPenderitaByKeluargaId(keluarga.keluarga_id)
      // Check if the hubungan was found
      if (!hubungan) {
        throw new Error('KELUARGA Account has not been connected to any PENDERITA Account');
      }
      const detailPenderitaList: DetailPenderita[] = [];
      for (const hubunganKeluarga of hubungan) {
        const detailPenderita = await this.detailPenderitaService.getDetailPenderitaByPenderitaId(hubunganKeluarga.penderita_id);
        if (detailPenderita !== null) {
          detailPenderitaList.push(detailPenderita);
        }
      }
      return detailPenderitaList;
    } catch (error) {
      throw new Error(`Failed to get DETAIL PENDERITA by KELUARGA Username ${error}`);
    }
  }
}

export default HubunganPenderitaService;