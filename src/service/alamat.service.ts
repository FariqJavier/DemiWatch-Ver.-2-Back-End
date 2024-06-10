import Alamat from '../models/alamat.model';
import PenderitaService from './penderita.service';

class AlamatService {

  constructor(
    private readonly penderitaService: PenderitaService,
  ) {} // Receives service as an argument

  async createNewAlamatTersimpan(data: {
    alamat_id: string;
    penderita_id: string;
    alamat: string;
    longitude: string;
    latitude: string;
  }): Promise<Alamat> {
    try {
      const alamat = await Alamat.create(data);
      return alamat;
    } catch (error) {
      throw new Error(`Failed to create new Alamat: ${error}`);
    }
  }

  async getSpecificAlamatByAlamatIdAndValidate(username: string, id: string): Promise<Alamat | undefined> {
    try { 
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }
        const alamatTersimpan = await this.getAllAlamatByPenderitaUsername(username)
        if (!alamatTersimpan) {
            throw new Error('Alamat Tersimpan not found');
          }
        const alamatSpecific = alamatTersimpan.find(alamat => alamat.alamat_id === id);
        return alamatSpecific;
    } catch (error) {
      throw new Error(`Failed to get Specific Alamat By Penderita: ${error}`);
    }
  }

  async getAllAlamatByPenderitaUsername(username: string): Promise<Alamat[] | null> {
    try {
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }
        const alamat = await Alamat.findAll({
            where: { penderita_id: penderita.penderita_id },
            order: [
            ['longitude', 'DESC'],
            ['latitude', 'DESC']
            ],      
        });
        return alamat;
    } catch (error) {
      throw new Error(`Failed to get All Alamat Tersimpan By Penderita Username: ${error}`);
    }
  }

  async updateAlamatByAlamatId(username: string, alamat_id: string, data: {
    alamat: string | null;
    longitude: Float32Array | null;
    latitude: Float32Array | null;
  }): Promise<[number, Alamat[]]> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      if (!penderita) {
        throw new Error('Penderita not found');
      }
      const alamat = await this.getSpecificAlamatByAlamatIdAndValidate(username, alamat_id)
      if (!alamat) {
        throw new Error('Alamat not found');
      }
      // Filter out null properties
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
      );
      const [updatedRows, updatedAlamat] = await Alamat.update(filteredData, {
        where: { 
          alamat_id: alamat.alamat_id,
          penderita_id: penderita.penderita_id
         },
        returning: true,
      });
      return [updatedRows, updatedAlamat];
    } catch (error) {
      throw new Error(`Failed to update Data Alamat Tersimpan: ${error}`);
    }
  }
  
  async deleteAlamatByAlamatId(username: string, id: string): Promise<number> {
    try {
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
        // Check if the keluarga was found
        if (!penderita) {
            throw new Error('Penderita Account not found');
        }
        const alamat = await this.getSpecificAlamatByAlamatIdAndValidate(username, id)
        // Check if the keluarga was found
        if (!alamat) {
            throw new Error('Alamat Tersimpan not found');
        }
        const deletedRows = await Alamat.destroy({ 
            where: { 
                alamat_id: alamat.alamat_id,
                penderita_id: penderita.penderita_id
             } 
        });
        return deletedRows;
    } catch (error) {
      throw new Error(`Failed to delete Alamat Tersimpan: ${error}`);
    }
  }

}

export default AlamatService;