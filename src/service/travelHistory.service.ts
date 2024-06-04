import TravelHistory from '../models/riwayatPerjalanan.model';

class TravelHistoryService {

  async createTravelHistory(data: {
    travel_id: string;
    patient_id: string;
    origin: string;
    destination: string;
    distance: Int16Array;
    travel_status: string;
  }): Promise<TravelHistory> {
    try {
      const history = await TravelHistory.create(data);
      return history;
    } catch (error) {
      throw new Error(`Failed to create Travel History: ${error}`);
    }
  }

  async getAllTravelHistoryByPatientId(id: string): Promise<TravelHistory[] | null> {
    try {
      const history = await TravelHistory.findAll({ 
        where: {
          patient_id: id,
        } 
      });

      return history;
    } catch (error) {
      throw new Error(`Failed to get all Travel History for Patient: ${error}`);
    }
  }

  async getTravelHistoryByPatientId(patient_id: string, travel_id: string): Promise<TravelHistory | null> {
    try {
      const history = await TravelHistory.findOne({
        where: {
            travel_id: travel_id,
            patient_id: patient_id
        }
      })
      return history;
    } catch (error) {
      throw new Error(`Failed to get Travel ID: ${error}`);
    }
  }

  async updateTravelHistoryByPatientId(patient_id: string, travel_id: string, data: {
    travel_status?: string;
    distance?: Int16Array;
  }): Promise<[number, TravelHistory[]]> {
    try {
      const [updatedRows, updatedHistory] = await TravelHistory.update(data, {
        where: {
            travel_id: travel_id,
            patient_id: patient_id
        },
        returning: true,
      });
      return [updatedRows, updatedHistory];
    } catch (error) {
      throw new Error(`Failed to update Travel History by Id: ${error}`);
    }
  }

  async deleteTravelHistoryById(patient_id: string, travel_id: string): Promise<number> {
    try {
      const deletedRows = await TravelHistory.destroy({ 
        where: { 
            travel_id: travel_id,
            patient_id: patient_id,
        } 
      });
      return deletedRows;
    } catch (error) {
      throw new Error(`Failed to delete Travel History ID: ${error}`);
    }
  }
}

export default TravelHistoryService;