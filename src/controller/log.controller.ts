import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import LogService from '../service/log.service';

class LogController {

  constructor(private readonly logService: LogService) {} // Receives service as an argument

  async getLogById(req: Request, res: Response): Promise<void> {
    try {
      const logId = req.params.id;
      const log = await this.logService.getLogById(logId);
      if (!log) {
        logger.error({ message: 'Log not found' })
        res.status(404).json({ message: 'Log not found' });
        return;
      }
      logger.info(`Log ID: ${logId} has been found`);
      res.status(200).json({
        message: `Log ID: ${logId} has been found`,
        data: log, 
      });
    } catch (error: any) {
      logger.error({ message: `Failed to get Log: ${error.message}` })
      res.status(500).json({ message: `Failed to get Log: ${error.message}` });
    }
  }

  async getAllLogs(req: Request, res: Response): Promise<void> {
    try {
      const logs = await this.logService.getAllLogs();
      if (!logs) {
        logger.error({ message: 'Log not found' })
        res.status(404).json({ message: 'Log not found' });
        return;
      }
      logger.info(`All Logs has been fetched: ${ logs.length }`);
      res.status(200).json({
        message: `All Logs has been fetched: ${ logs.length }`,
        data: logs, 
      });
    } catch (error: any) {
      logger.error({ message: `Failed to fetch all Logs: ${error.message}` })
      res.status(500).json({ message: `Failed to fetch all Logs: ${error.message}` });
    }
  }

  async deleteAllLogs(req: Request, res: Response): Promise<void> {
    try {
      // Check if any logs exist before deletion
      const logs = await this.logService.getAllLogs();
      if (!logs.length) {
        logger.error({ message: 'Log not found' })
        res.status(404).json({ message: 'Log not found' });
        return;
      }
      await this.logService.deleteAllLogs();
      logger.info(`All logs has been deleted`);
      res.status(200).json({
        message: `All logs has been deleted`, 
      });
    } catch (error: any) {
      logger.error({ message: `Failed to delete all logs` })
      res.status(500).json({ message: `Failed to delete all logs` });
    }
  }
}

export default LogController;