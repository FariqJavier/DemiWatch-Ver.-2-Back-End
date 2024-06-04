import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import logger from "../utils/logger";
import LogService from '../service/log.service'
import PatientService from '../service/penderita.service';
import AddressService from '../service/address.service';
import { add } from 'lodash';

class AddressController {

  constructor(
    private readonly patientService: PatientService,
    private readonly addressService: AddressService,
    private readonly logService: LogService,
  ) {} // Receives service as an argument

  // AUTHORIZED ENDPOINT
  async createHomeAddressByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        var addressUUID = uuidv4();
        while (true){
          const newUUID = await this.logService.existingId(addressUUID);
          if (!newUUID) {
            break;
          }
          addressUUID = uuidv4()
          logger.error({ message: 'UUID is already exist' })
        }

        const { 
          address_name,
          latitude,
          longitude } = req.body;

        const patientId = req.params.id
        const address = await this.addressService.createHomeAddress({
          address_id: addressUUID,
          patient_id: patientId,
          address_type: 'HOME',
          address_name,
          latitude,
          longitude,
        })      
        logger.info(`Home Address for Patient ID: ${patientId} created succesfully`);

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
          entity_type: "ADDRESS",
          entity_id: addressUUID,
          action: "CREATE"
        });
        logger.info(`Logged CREATE action for entity type: ADDRESS, entity ID: ${addressUUID}`);

        res.status(201).json({
          message: `Home Address for Patient ID: ${patientId} created successfully`,
          data: address
        })
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create Home Address for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to create Home Address for Patient ID: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async createDestinationAddressByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        var addressUUID = uuidv4();
        while (true){
          const newUUID = await this.logService.existingId(addressUUID);
          if (!newUUID) {
            break;
          }
          addressUUID = uuidv4()
          logger.error({ message: 'UUID is already exist' })
        }

        const { 
          address_name,
          latitude,
          longitude } = req.body;

        const patientId = req.params.id
        const address = await this.addressService.createDestinationAddress({
          address_id: addressUUID,
          patient_id: patientId,
          address_type: 'DESTINATION',
          address_name,
          latitude,
          longitude,
        })      
        logger.info(`Destination Address for Patient ID: ${patientId} created succesfully`);

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
          entity_type: "ADDRESS",
          entity_id: addressUUID,
          action: "CREATE"
        });
        logger.info(`Logged CREATE action for entity type: ADDRESS, entity ID: ${addressUUID}`);

        res.status(201).json({
          message: `Destination Address for Patient ID: ${patientId} created successfully`,
          data: address
        })
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create Destination Address for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to create Destination Address for Patient ID: ${error.message}` });
    }
  }
  
  // AUTHORIZED ENDPOINT
  async getHomeAddressByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const patientId = req.params.id;
        const address = await this.addressService.getAllHomeAddressByPatientId(patientId)
        if (address) {
          logger.info(`All Home Address for Patient ID: ${patientId} has been found`);
          res.status(200).json({
            message: `All Home Address for Patient ID: ${patientId} has been found`,
            data: address, 
          });
        } else {
          logger.error({ message: 'Patient ID not found' })
          res.status(404).json({ message: 'Patient ID not found' });
        }
      }
    } catch (error: any) {
      logger.error({ message: `Failed to get All Home Address for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to get All Home Address Patient ID: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async getDestinationAddressByPatientId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const patientId = req.params.id;
        const address = await this.addressService.getAllDestinationAddressByPatientId(patientId)
        if (address) {
          logger.info(`All Destination Address for Patient ID: ${patientId} has been found`);
          res.status(200).json({
            message: `All Destination Address for Patient ID: ${patientId} has been found`,
            data: address, 
          });
        } else {
          logger.error({ message: 'Patient ID not found' })
          res.status(404).json({ message: 'Patient ID not found' });
        }
      }
    } catch (error: any) {
      logger.error({ message: `Failed to get All Destination Address for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to get All Destination Address Patient ID: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async updateAddressByAddressId(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        const { 
          patientId,
          addressId } = req.params;
        const {
          address_name,
          latitude,
          longitude } = req.body
        const [updatedRows, updatedAddress] = await this.addressService.updateAddressByAddressId(
          patientId,
          addressId, {
            address_name,
            latitude,
            longitude
          }
        )
        if (!updatedAddress) {
          logger.error({ message: 'Address ID or Patient ID not found' })
          res.status(404).json({ message: 'Address ID or Patient ID not found' });
          return;
        }
        if (updatedRows === 0) {
          logger.error({ message: 'Address ID or Patient ID not found' })
          res.status(404).json({ message: 'Address ID or Patient ID not found' });
          return;
        }
        logger.info(`Address ID: ${addressId} for Patient ID: ${patientId} has been updated`);

        res.status(200).json({
          message: `Address ID: ${addressId} for Patient ID: ${patientId} has been updated`,
          data: JSON.stringify(updatedAddress[0]), 
        });
      }
    } catch (error: any) {
      logger.error({ message: `Failed to update Address ID for Patient ID: ${error.message}` })
      res.status(500).json({ message: `Failed to update Address ID Patient ID: ${error.message}` });
    }
  }
}

export default AddressController;