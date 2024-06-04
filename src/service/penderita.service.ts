import Penderita from '../models/penderita.model';

class PenderitaService {

  async createPenderita(data: {
    penderita_id: string;
    username: string;
    password: string;
  }): Promise<Penderita> {
    try {
      const penderita = await Penderita.create(data);
      return penderita;
    } catch (error: any) {
      throw new Error(`Failed to create Penderita Account: ${error}`);
    }
  }

  async getPenderitaByPenderitaUsername(username: string): Promise<Penderita | null> {
    try {
      const penderita = await Penderita.findOne({
        where: { username: username }
      });
      return penderita;
    } catch (error) {
      throw new Error(`Failed to get Penderita Account: ${error}`);
    }
  }

  async getPenderitaByPenderitaId(id: string): Promise<Penderita | null> {
    try {
      const penderita = await Penderita.findOne({
        where: { penderita_id: id }
      });
      return penderita;
    } catch (error) {
      throw new Error(`Failed to get Penderita Account: ${error}`);
    }
  }

  async updatePenderitaByPenderitaUsername(username: string, data: {
    username?: string | null;
    password?: string | null;
  }): Promise<[number, Penderita[]]> {
    try {
      // Filter out null properties
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
      );
      const penderita = await this.getPenderitaByPenderitaUsername(username);
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const [updatedRows, updatedPenderita] = await Penderita.update(filteredData, {
        where: { 
          penderita_id: penderita.penderita_id
        },
        returning: true,
      });
      return [updatedRows, updatedPenderita];
    } catch (error) {
      throw new Error(`Failed to update Penderita Account: ${error}`);
    }
  }

  async deletePenderitaByPenderitaUsername(username: string): Promise<number> {
    try {
      const penderita = await this.getPenderitaByPenderitaUsername(username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }
      const deletedRows = await Penderita.destroy({ 
        where: { penderita_id: penderita.penderita_id } 
      });
      return deletedRows;
    } catch (error) {
      throw new Error(`Failed to delete Penderita Account: ${error}`);
    }
  }
}

export default PenderitaService;