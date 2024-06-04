import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import LogService from '../service/log.service'
import DemiWatchService from '../service/detailKeluarga.service';

class DemiWatchController {

  constructor(
    private readonly demiWatchService : DemiWatchService,
    private readonly logService : LogService,
  ) {} // Receives service as an argument

  async createDemiWatch(req: Request, res: Response): Promise<void> {
    try {
      var UUID = uuidv4();
      while (true){
        const newUUID = await this.logService.existingId(UUID);
        if (!newUUID) {
          break;
        }
        UUID = uuidv4()
        logger.error({ message: 'UUID is already exist' })
      }

      const { status, button, mac_address_hex} = req.body;
      const demiWatch = await this.demiWatchService.createDemiWatch({ 
        demi_id: UUID,
        mac_address_hex,
        status, 
        button, 
      });
      logger.info(`DemiWatch created succesfully`);   

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
        entity_type: "DEMIWATCH",
        entity_id: UUID,
        action: "CREATE"
      });
      logger.info(`Logged CREATE action for entity type: DEMIWATCH, entity ID: ${UUID}`);

      res.status(201).json({
        message: 'DemiWatch created successfully',
        log_message: `Logged CREATE action for entity type: DEMIWATCH, entity ID: ${UUID}`,
        data: demiWatch, 
      })

    } catch (error: any) {
      logger.error({ message: `Failed to create DemiWatch: ${error.message}` })
      res.status(500).json({ message: `Failed to create DemiWatch: ${error.message}` });
    }
  }

  async getDemiWatchById(req: Request, res: Response): Promise<void> {
    try {
      const demiWatchId = req.params.id;
      const demiWatch = await this.demiWatchService.getDemiWatchById(demiWatchId);
      if (demiWatch) {
        logger.info(`DemiWatch ID: ${demiWatchId} has been found`);
        res.status(200).json({
            message: `DemiWatch ID: ${demiWatchId} has been found`,
            data: demiWatch, 
        });
      } else {
        logger.error({ message: 'DemiWatch ID not found' })
        res.status(404).json({ message: 'DemiWatch ID not found' });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to get DemiWatch ID: ${error.message}` })
      res.status(500).json({ message: `Failed to get DemiWatch ID: ${error.message}` });
    }
  }

  async updateDataDemiWatchById(req: Request, res: Response): Promise<void> {
    try {
      const demiWatchId = req.params.id;
      const { status, button } = req.body;
      const [updatedRows, updatedDemiWatch] = await this.demiWatchService.updateDataDemiWatch(demiWatchId,{       
        status, 
        button 
      });
      if (!updatedDemiWatch) {
        logger.error({ message: 'DemiWatch ID not found' })
        res.status(404).json({ message: 'DemiWatch ID not found' });
        return;
      }
      if (updatedRows === 0) {
        logger.error({ message: 'DemiWatch ID not found' })
        res.status(404).json({ message: 'DemiWatch ID not found' });
        return;
      } 
      logger.info(`DemiWatch ID: ${demiWatchId} has been updated`);

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
        entity_type: "DEMIWATCH",
        entity_id: demiWatchId,
        action: "UPDATE"
      });
      logger.info(`Logged UPDATE action for entity type: DEMIWATCH, entity ID: ${demiWatchId}`);

      res.status(200).json({
        message: `DemiWatch ID: ${demiWatchId} has been updated`,
        log_message: `Logged UPDATE action for entity type: DEMIWATCH, entity ID: ${demiWatchId}`,
        data: JSON.stringify(updatedDemiWatch[0]), 
      });

    } catch (error: any) {
      logger.error({ message: `Failed to update DemiWatch ID: ${error.message}` })
      res.status(500).json({ message: `Failed to update DemiWatch ID: ${error.message}` });
    }
  }

  async updateDeviceDemiWatchById(req: Request, res: Response): Promise<void> {
    try {
      const demiWatchId = req.params.id;
      const { mac_address_hex } = req.body;
      const [updatedRows, updatedDemiWatch] = await this.demiWatchService.updateDeviceDemiWatch(demiWatchId,{       
        mac_address_hex
      });
      if (!updatedDemiWatch) {
        logger.error({ message: 'DemiWatch ID not found' })
        res.status(404).json({ message: 'DemiWatch ID not found' });
        return;
      }
      if (updatedRows === 0) {
        logger.error({ message: 'DemiWatch ID not found' })
        res.status(404).json({ message: 'DemiWatch ID not found' });
        return;
      } 
      logger.info(`Device DemiWatch ID: ${demiWatchId} has been updated`);

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
        entity_type: "DEMIWATCH",
        entity_id: demiWatchId,
        action: "UPDATE"
      });
      logger.info(`Logged UPDATE action for entity type: DEMIWATCH, entity ID: ${demiWatchId}`);

      res.status(200).json({
        message: `Device DemiWatch ID: ${demiWatchId} has been updated`,
        log_message: `Logged UPDATE action for entity type: DEMIWATCH, entity ID: ${demiWatchId}`,
        data: JSON.stringify(updatedDemiWatch[0]), 
      });

    } catch (error: any) {
      logger.error({ message: `Failed to update Device DemiWatch ID: ${error.message}` })
      res.status(500).json({ message: `Failed to update Device DemiWatch ID: ${error.message}` });
    }
  }

  async deleteDemiWatchById(req: Request, res: Response): Promise<void> {
    try {
      const demiWatchId = req.params.id;
      const deletedRows = await this.demiWatchService.deleteDemiWatch(demiWatchId);
      if (deletedRows === 0) {
        logger.error({ message: 'DemiWatch ID not found' })
        res.status(404).json({ message: 'DemiWatch ID not found' });
        return;
      }
      logger.info(`DemiWatch ID: ${demiWatchId} has been deleted`);

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
        entity_type: "DEMIWATCH",
        entity_id: demiWatchId,
        action: "DELETE"
      });
      logger.info(`Logged DELETE action for entity type: DEMIWATCH, entity ID: ${demiWatchId}`);

      res.status(200).json({
        message: `DemiWatch ID: ${demiWatchId} has been deleted`, 
        log_message: `Logged DELETE action for entity type: DEMIWATCH, entity ID: ${demiWatchId}`,
      });
      res.status(204).end()

    } catch (error: any) {
      logger.error({ message: `Failed to delete DemiWatch ID: ${error.message}` });
      res.status(500).json({ message: `Failed to delete DemiWatch ID: ${error.message}` });
    }
  }
}

export default DemiWatchController;