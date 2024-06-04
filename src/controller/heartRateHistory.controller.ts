import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import logger from "../utils/logger";
import LogService from '../service/log.service'
import PatientService from '../service/penderita.service';
import HeartRateHistoryService from '../service/heartRateHistory.service';
import { add } from 'lodash';

class HeartRateHistoryController {

  constructor(
    private readonly patientService: PatientService,
    private readonly heartRateHistoryService: HeartRateHistoryService,
    private readonly logService: LogService,
  ) {} // Receives service as an argument

  // AUTHORIZED ENDPOINT
  async createHeartRateHistoryByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        var heartRateHistoryUUID = uuidv4();
        while (true){
          const newUUID = await this.logService.existingId(heartRateHistoryUUID);
          if (!newUUID) {
            break;
          }
          heartRateHistoryUUID = uuidv4()
          logger.error({ message: 'UUID is already exist' })
        }

        const { 
            heart_rate_value,
            heart_rate_status } = req.body;

        const patientId = req.params.id
        const history = await this.heartRateHistoryService.createHeartRateHistory({
          heart_rate_id: heartRateHistoryUUID,
          patient_id: patientId,
          heart_rate_value,
          heart_rate_status,
        })      
        logger.info(`Heart Rate History for Patient ID: ${patientId} created succesfully`);

        var logUUID = uuidv4();
        while (true){
          const newUUID = await this.logService.existingId(logUUID);
          if (!newUUID) {
            break;
          }
          logUUID = uuidv4()
          logger.error({ message: 'UUID is already exist' })
        }

        await this.logService.createLog({
          log_id: logUUID,
          entity_type: "HEARTRATEHISTORY",
          entity_id: heartRateHistoryUUID,
          action: "CREATE"
        });
        logger.info(`Logged CREATE action for entity type: HEARTRATEHISTORY, entity ID: ${heartRateHistoryUUID}`);

        res.status(201).json({
          message: `Heart Rate History for Patient ID: ${patientId} created successfully`,
          data: history
        })
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create Heart Rate History for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to create Heart Rate History for Patient ID: ${error.message}` });
    }
  }
  
  // AUTHORIZED ENDPOINT
  async getAllHeartRateHistoryByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const patientId = req.params.id;
        const history = await this.heartRateHistoryService.getAllHeartRateHistoryByPatientId(patientId)
        if (history) {
          logger.info(`All Heart Rate History for Patient ID: ${patientId} has been found`);
          res.status(200).json({
            message: `All Heart Rate History for Patient ID: ${patientId} has been found`,
            data: history, 
          });
        } else {
          logger.error({ message: 'Patient ID not found' })
          res.status(404).json({ message: 'Patient ID not found' });
        }
      }
    } catch (error: any) {
      logger.error({ message: `Failed to get All Heart Rate History for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to get All Heart Rate History Patient ID: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async getCurrentHeartRateHistoryByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const {
            patientId,
            heartRateId
        } = req.params;
        const history = await this.heartRateHistoryService.getCurrentHeartRateHistoryByPatientId(
            patientId,
            heartRateId, 
        )
        if (history) {
          logger.info(`Heart Rate History ID for Patient ID: ${patientId} has been found`);
          res.status(200).json({
            message: `Heart Rate History ID for Patient ID: ${patientId} has been found`,
            data: history, 
          });
        } else {
          logger.error({ message: 'Patient ID / Heart Rate ID not found' })
          res.status(404).json({ message: 'Patient ID / Heart Rate ID not found' });
        }
      }
    } catch (error: any) {
      logger.error({ message: `Failed to get Heart Rate History ID for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to get Heart Rate History ID Patient ID: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async updateTravelHistoryByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { 
          patientId,
          heartRateId } = req.params;
        const {
          heart_rate_status,
          heart_rate_value } = req.body
        const [updatedRows, updatedHistory] = await this.heartRateHistoryService.updateHeartRateHistoryByPatientId(
          patientId,
          heartRateId, {
            heart_rate_status,
            heart_rate_value
          }
        )
        if (!updatedHistory) {
          logger.error({ message: 'Heart Rate ID / Patient ID not found' })
          res.status(404).json({ message: 'Heart Rate ID / Patient ID not found' });
          return;
        }
        if (updatedRows === 0) {
          logger.error({ message: 'Heart Rate ID / Patient ID not found' })
          res.status(404).json({ message: 'Heart Rate ID / Patient ID not found' });
          return;
        }
        logger.info(`HeartRate ID: ${heartRateId} for Patient ID: ${patientId} has been updated`);

        res.status(200).json({
          message: `Heart Rate ID: ${heartRateId} for Patient ID: ${patientId} has been updated`,
          data: JSON.stringify(updatedHistory[0]), 
        });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to update Heart Rate ID for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to update Heart Rate ID Patient ID: ${error.message}` });
    }
  }
}

export default HeartRateHistoryController;