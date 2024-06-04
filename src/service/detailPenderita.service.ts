import { Op, Sequelize } from 'sequelize';
import DetailPenderita from '../models/detailPenderita.model';
import PenderitaService from './penderita.service';

class DetailPenderitaService {

  constructor(
    private readonly penderitaService: PenderitaService,
  ) {} // Receives service as an argument

  async createDetailPenderita(data: {
    detail_penderita_id: string;
    penderita_id: string;
    nama: string;
    alamat_rumah: string;
    tanggal_lahir: Date;
    gender: 'Laki-laki' | 'Perempuan'
  }): Promise<DetailPenderita> {
    try {
      const detailPenderita = await DetailPenderita.create(data);
      return detailPenderita;
    } catch (error) {
      throw new Error(`Failed to create Detail Penderita: ${error}`);
    }
  }

  async getDetailPenderitaByPenderitaUsername(username: string): Promise<DetailPenderita | null> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const detailPenderita = await DetailPenderita.findOne({
        where: { penderita_id: penderita.penderita_id }
      })
      return detailPenderita;
    } catch (error) {
      throw new Error(`Failed to get Detail Penderita by Penderita Username Account: ${error}`);
    }
  }

  async getDetailPenderitaByPenderitaId(id: string): Promise<DetailPenderita | null> {
    try {
      const detailPenderita = await DetailPenderita.findByPk(id)
      return detailPenderita;
    } catch (error) {
      throw new Error(`Failed to get Detail Penderita by Penderita Username Account: ${error}`);
    }
  }

  async getDetailPenderitaByImperfectDetailPenderitaData( data: {
    nama: string;
    alamat_rumah: string;
    tanggal_lahir: Date;
    gender: 'Laki-laki' | 'Perempuan'
  }): Promise<DetailPenderita[] | null> {
    try {

      const penderita = await DetailPenderita.findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.fn('REPLACE', Sequelize.col('nama'), ' ', '')),
              // Sequelize.fn('LOWER', Sequelize.col('nama')),
              {
                [Op.like]: `%${data.nama.toLowerCase().replace(/\s/g, '')}%`
              }
            ),
            Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.fn('REPLACE', Sequelize.col('alamat_rumah'), ' ', '')),
              // Sequelize.fn('LOWER', Sequelize.col('alamat_rumah')),
              {
                [Op.like]: `%${data.alamat_rumah.toLowerCase().replace(/\s/g, '')}%`
              }
            ),
            {
              tanggal_lahir: {
                [Op.gte]: new Date(data.tanggal_lahir.getFullYear(), data.tanggal_lahir.getMonth(), data.tanggal_lahir.getDate())
              },
              gender: data.gender
            }
          ]
        }
      });
      // const penderita = await DetailPenderita.findOne({
      //   where: {
      //     nama: {
      //       [Op.like]: `%${data.nama}%`
      //     },
      //     alamat_rumah: {
      //       [Op.like]: `%${data.alamat_rumah}%`
      //     },
      //     tanggal_lahir: {
      //       [Op.gte]: new Date(data.tanggal_lahir.getFullYear(), data.tanggal_lahir.getMonth(), data.tanggal_lahir.getDate())
      //     },
      //     gender: data.gender
      //   }
      // });
      return penderita;
    } catch (error) {
      throw new Error(`Failed to get Detail Penderita: ${error}`);
    }
  }

  async updateDetailPenderitaByPenderitaUsername(username: string, data: {
    nama: string | null;
    alamat_rumah: string | null;
    tanggal_lahir: Date | null;
    gender: 'Laki-laki' | 'Perempuan' | null;
  }): Promise<[number, DetailPenderita[]]> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      // Filter out null properties
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
      );
      const [updatedRows, updatedDetailPenderita] = await DetailPenderita.update(filteredData, {
        where: { penderita_id: penderita.penderita_id },
        returning: true,
      });
      return [updatedRows, updatedDetailPenderita];
    } catch (error) {
      throw new Error(`Failed to update Detail Penderita by Penderita Username Account: ${error}`);
    }
  }

  async deletePenderitaAccountByPenderitaUsername(username: string): Promise<number> {
    try {
      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const deleteDetailPenderitaRows = await DetailPenderita.destroy({ 
        where: { penderita_id: penderita.penderita_id } 
      });
      const deletePenderitaRows = await this.penderitaService.deletePenderitaByPenderitaUsername(username);
      return deleteDetailPenderitaRows;
    } catch (error) {
      throw new Error(`Failed to delete Detail Penderita and Penderita account by Penderita Username Account: ${error}`);
    }
  }
}

export default DetailPenderitaService;