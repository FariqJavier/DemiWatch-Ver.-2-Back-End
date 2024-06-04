import DetailKeluarga from '../models/detailKeluarga.model';
import KeluargaService from './keluarga.service';

class DetailKeluargaService {

  constructor(
    private readonly keluargaService: KeluargaService,
  ) {} // Receives service as an argument

  async createDetailKeluarga(data: {
    detail_keluarga_id: string;
    keluarga_id: string;
    nama: string;
    nomor_hp: string;
  }): Promise<DetailKeluarga> {
    try {
      const detailKeluarga = await DetailKeluarga.create(data);
      return detailKeluarga;
    } catch (error) {
      throw new Error(`Failed to create Detail Keluarga for Keluarga ID: ${error}`);
    }
  }

  async getDetailKeluargaByKeluargaUsername(username: string): Promise<DetailKeluarga | null> {
    try {
      const keluarga = await this.keluargaService.getKeluargaByKeluargaUsername(username)
      // Check if the penderita was found
      if (!keluarga) {
        throw new Error('Keluarga Account not found');
      }
      const detailKeluarga = await DetailKeluarga.findOne({
        where: { keluarga_id: keluarga.keluarga_id }
      })
      return detailKeluarga;
    } catch (error) {
      throw new Error(`Failed to get Detail Keluarga by Keluarga Username Account: ${error}`);
    }
  }

  async getDetailKeluargaByKeluargaId(id: string): Promise<DetailKeluarga | null> {
    try {
      const detailKeluarga = await DetailKeluarga.findByPk(id)
      return detailKeluarga;
    } catch (error) {
      throw new Error(`Failed to get Detail Keluarga by Keluarga Username Account: ${error}`);
    }
  }

  async updateDetailKeluargaByKeluargaUsername(username: string, data: {
    nama: string | null;
    nomor_hp: string | null;
  }): Promise<[number, DetailKeluarga[]]> {
    try {
      const keluarga = await this.keluargaService.getKeluargaByKeluargaUsername(username)
      // Check if the Keluarga was found
      if (!keluarga ) {
        throw new Error('Keluarga Account not found');
      }
      // Filter out null properties
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
      );
      const [updatedRows, updatedDetailKeluarga] = await DetailKeluarga.update(filteredData, {
        where: { keluarga_id: keluarga.keluarga_id },
        returning: true,
      });
      return [updatedRows, updatedDetailKeluarga];
    } catch (error) {
      throw new Error(`Failed to update Detail Keluarga by Keluarga Username Account: ${error}`);
    }
  }

  async deleteKeluargaAccountByKeluargaUsername(username: string): Promise<number> {
    try {
      const keluarga = await this.keluargaService.getKeluargaByKeluargaUsername(username)
      // Check if the penderita was found
      if (!keluarga) {
        throw new Error('Keluarga Account not found');
      }
      const deleteDetailKeluargaRows = await DetailKeluarga.destroy({ 
        where: { keluarga_id: keluarga.keluarga_id } 
      });
      const deleteKeluargaRows = await this.keluargaService.deleteKeluargaByKeluargaUsername(username);
      return deleteDetailKeluargaRows;
    } catch (error) {
      throw new Error(`Failed to delete Detail Keluarga and Keluarga account by Keluarga Username Account: ${error}`);
    }
  }
}

export default DetailKeluargaService;