import HeartRateHistory from '../models/heartRateHistory.model';

class HeartRateHistoryService {

  async createHeartRateHistory(data: {
    heart_rate_id: string;
    patient_id: string;
    heart_rate_value: Int16Array;
    heart_rate_status: string;
  }): Promise<HeartRateHistory> {
    try {
      const history = await HeartRateHistory.create(data);
      return history;
    } catch (error) {
      throw new Error(`Failed to create Heart Rate History: ${error}`);
    }
  }

  async getAllHeartRateHistoryByPatientId(id: string): Promise<HeartRateHistory[] | null> {
    try {
      const history = await HeartRateHistory.findAll({ 
        where: {
          patient_id: id,
        } 
      });

      return history;
    } catch (error) {
      throw new Error(`Failed to get all Heart Rate History for Patient: ${error}`);
    }
  }

  async getCurrentHeartRateHistoryByPatientId(patient_id: string, heart_rate_id: string): Promise<HeartRateHistory | null> {
    try {
      const history = await HeartRateHistory.findOne({
        where: {
            heart_rate_id: heart_rate_id,
            patient_id: patient_id
        }
      })
      return history;
    } catch (error) {
      throw new Error(`Failed to get current Heart Rate History Patient ID: ${error}`);
    }
  }

  async updateHeartRateHistoryByPatientId(patient_id: string, heart_rate_id: string, data: {
    heart_rate_status?: string;
    heart_rate_value?: Int16Array;
  }): Promise<[number, HeartRateHistory[]]> {
    try {
      const [updatedRows, updatedHistory] = await HeartRateHistory.update(data, {
        where: {
            heart_rate_id: heart_rate_id,
            patient_id: patient_id
        },
        returning: true,
      });
      return [updatedRows, updatedHistory];
    } catch (error) {
      throw new Error(`Failed to update Heart Rate History by Patient Id: ${error}`);
    }
  }

  async deleteHeartRateHistoryById(patient_id: string, heart_rate_id: string): Promise<number> {
    try {
      const deletedRows = await HeartRateHistory.destroy({ 
        where: { 
            heart_rate_id: heart_rate_id,
            patient_id: patient_id,
        } 
      });
      return deletedRows;
    } catch (error) {
      throw new Error(`Failed to delete Heart Rate History Patient ID: ${error}`);
    }
  }
}

export default HeartRateHistoryService;