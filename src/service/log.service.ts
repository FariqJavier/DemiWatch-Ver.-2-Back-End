import Log from '../models/lokasiTerakhir.model';
import connection from "../utils/config";

interface QueryOptions {
  replacements?: string[]; 
}

class LogService {

  async createLog(data: {
    log_id: string;
    entity_type: string;
    entity_id: string;
    action: string;
  }): Promise<Log | undefined> {
    try {
      const log = await Log.create(data);
      await connection.query(
        `INSERT INTO log (entity_type, entity_id, action) VALUES (?, ?, ?)`,
        { replacements: [data.entity_type, data.entity_id, data.action] },
      );
      return log;
    } catch (error) {
      // throw new Error(`Failed to create Log: ${error}`);
    }
  }

  async getLogById(id: string): Promise<Log | null> {
    try {
      const log = await Log.findByPk(id);
      return log;
    } catch (error) {
      throw new Error(`Failed to get Log: ${error}`);
    }
  }

  async getAllLogs(): Promise<Log[]>{
    try {
      const logs = await Log.findAll({
        where: {  },
        limit: 10,
      });
      return logs;
    } catch (error) {
      throw new Error(`Failed to fetch all Logs: ${error}`);
    }
  }

  async existingId(entity_id: string): Promise<Log | null> {
    try {
      const existingId = await Log.findOne({ where: { entity_id: entity_id } });
      return existingId
    } catch (error) {
      throw new Error(`Failed to check Log: ${error}`);
    }
  }

  async deleteAllLogs(): Promise<void> {
    try {
      // await Log.destroy({ truncate: true }); 
      await Log.destroy({ where: {} }); 
    } catch (error) {
      throw new Error(`Failed to delete all Logs: ${error}`);
    }
  }
}

export default LogService;