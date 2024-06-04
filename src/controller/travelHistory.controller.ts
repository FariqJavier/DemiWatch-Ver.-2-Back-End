import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import logger from "../utils/logger";
import LogService from '../service/log.service'
import PatientService from '../service/penderita.service';
import TravelHistoryService from '../service/travelHistory.service';
import { add } from 'lodash';

class TravelHistoryController {

  constructor(
    private readonly patientService: PatientService,
    private readonly travelHistoryService: TravelHistoryService,
    private readonly logService: LogService,
  ) {} // Receives service as an argument

  // AUTHORIZED ENDPOINT
  async createTravelHistoryByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        var travelHistoryUUID = uuidv4();
        while (true){
          const newUUID = await this.logService.existingId(travelHistoryUUID);
          if (!newUUID) {
            break;
          }
          travelHistoryUUID = uuidv4()
          logger.error({ message: 'UUID is already exist' })
        }

        const { 
            origin,
            destination,
            distance,
            travel_status, } = req.body;

        const patientId = req.params.id
        const history = await this.travelHistoryService.createTravelHistory({
          travel_id: travelHistoryUUID,
          patient_id: patientId,
          origin,
          destination,
          distance,
          travel_status,
        })      
        logger.info(`Travel History for Patient ID: ${patientId} created succesfully`);

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
          entity_type: "TRAVELHISTORY",
          entity_id: travelHistoryUUID,
          action: "CREATE"
        });
        logger.info(`Logged CREATE action for entity type: TRAVELHISTORY, entity ID: ${travelHistoryUUID}`);

        res.status(201).json({
          message: `Travel History for Patient ID: ${patientId} created successfully`,
          data: history
        })
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create Travel History for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to create Travel History for Patient ID: ${error.message}` });
    }
  }
  
  // AUTHORIZED ENDPOINT
  async getAllTravelHistoryByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const patientId = req.params.id;
        const history = await this.travelHistoryService.getAllTravelHistoryByPatientId(patientId)
        if (history) {
          logger.info(`All Travel History for Patient ID: ${patientId} has been found`);
          res.status(200).json({
            message: `All Travel History for Patient ID: ${patientId} has been found`,
            data: history, 
          });
        } else {
          logger.error({ message: 'Patient ID not found' })
          res.status(404).json({ message: 'Patient ID not found' });
        }
      }
    } catch (error: any) {
      logger.error({ message: `Failed to get All Travel History for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to get All Travel History Patient ID: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async getTravelHistoryByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const {
            patientId,
            travelId
        } = req.params;
        const history = await this.travelHistoryService.getTravelHistoryByPatientId(
            patientId,
            travelId, 
        )
        if (history) {
          logger.info(`Travel History ID for Patient ID: ${patientId} has been found`);
          res.status(200).json({
            message: `Travel History ID for Patient ID: ${patientId} has been found`,
            data: history, 
          });
        } else {
          logger.error({ message: 'Patient ID / Travel ID not found' })
          res.status(404).json({ message: 'Patient ID / Travel ID not found' });
        }
      }
    } catch (error: any) {
      logger.error({ message: `Failed to get Travel History ID for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to get Travel History ID Patient ID: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async updateTravelHistoryByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { 
          patientId,
          travelId } = req.params;
        const {
          distance,
          travel_status } = req.body
        const [updatedRows, updatedHistory] = await this.travelHistoryService.updateTravelHistoryByPatientId(
          patientId,
          travelId, {
            travel_status,
            distance
          }
        )
        if (!updatedHistory) {
          logger.error({ message: 'Travel ID / Patient ID not found' })
          res.status(404).json({ message: 'Travel ID / Patient ID not found' });
          return;
        }
        if (updatedRows === 0) {
          logger.error({ message: 'Travel ID / Patient ID not found' })
          res.status(404).json({ message: 'Travel ID / Patient ID not found' });
          return;
        }
        logger.info(`Travel ID: ${travelId} for Patient ID: ${patientId} has been updated`);

        res.status(200).json({
          message: `Travel ID: ${travelId} for Patient ID: ${patientId} has been updated`,
          data: JSON.stringify(updatedHistory[0]), 
        });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to update Travel ID for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to update Travel ID Patient ID: ${error.message}` });
    }
  }
}

export default TravelHistoryController;