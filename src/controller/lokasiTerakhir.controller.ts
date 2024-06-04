import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import LokasiTerakhirService from '../service/lokasiTerakhir.service';

class LokasiTerakhirController {

  constructor(
    private readonly lokasiTerakhirService: LokasiTerakhirService,
  ) {} // Receives service as an argument
    
  async createLokasiTerakhir(req: Request, res: Response): Promise<void> {
    try {

      var patientFamilyDetailUUID = uuidv4();
      while (true){
        const newUUID = await this.logService.existingId(patientFamilyDetailUUID);
        if (!newUUID) {
          break;
        }
        patientFamilyDetailUUID = uuidv4()
        logger.error({ message: 'UUID is already exist' })
      }

      var deviceFamilyUUID = uuidv4();
      while (true){
        const newUUID = await this.logService.existingId(deviceFamilyUUID);
        if (!newUUID) {
          break;
        }
        deviceFamilyUUID = uuidv4()
        logger.error({ message: 'UUID is already exist' })
      }

      const { mac_address_device_hex,
        token_device,
        model_device, } = req.body;
      
      const deviceFamily = await this.deviceFamilyService.createDeviceFamily({
        device_family_id: deviceFamilyUUID,
        mac_address_hex: mac_address_device_hex,
        token_device,
        model_device
      })      
      logger.info(`DeviceFamily created succesfully`);

      const patientFamilyDetail = await this.patientFamilyDetailService.createPatientFamilyDetail({ 
        patient_family_detail_id: patientFamilyDetailUUID,
        device_family_id: deviceFamilyUUID,
      });
      logger.info(`PatientFamilyDetail created succesfully`);

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
        entity_type: "DEVICEFAMILY",
        entity_id: deviceFamilyUUID,
        action: "CREATE"
      });
      logger.info(`Logged CREATE action for entity type: DEVICEFAMILY, entity ID: ${deviceFamilyUUID}`);

      await this.logService.createLog({
        log_id: logUUID,
        entity_type: "PATIENTFAMILYDETAIL",
        entity_id: patientFamilyDetailUUID,
        action: "CREATE"
      });
      logger.info(`Logged CREATE action for entity type: PATIENTFAMILYDETAIL, entity ID: ${patientFamilyDetailUUID}`);

      res.status(201).json({
        message: 'PATIENTFAMILYDETAIL and DEVICEFAMILY created successfully',
        patientFamilyDetail_log_message: `Logged CREATE action for entity type: PATIENTFAMILYDETAIL, entity ID: ${patientFamilyDetailUUID}`,
        device_log_message: `Logged CREATE action for entity type: DEVICEFAMILY, entity ID: ${deviceFamilyUUID}`,
        data: {
          patientFamilyDetail: patientFamilyDetail,
          deviceFamily: deviceFamily, 
        }
      })

    } catch (error: any) {
      logger.error({ message: `Failed to create PatientFamilyDetail: ${error.message}` })
      res.status(500).json({ message: `Failed to create PatientFamilyDetail: ${error.message}` });
    }
  }

  // async getKeluargaPenderitaById(req: Request, res: Response): Promise<void> {
  //   try {
  //     const keluargaPenderitaId = parseInt(req.params.id);
  //     const keluargaPenderita = await this.keluargaPenderitaService.getKeluargaPenderitaById(keluargaPenderitaId);
  //     if (keluargaPenderita) {
  //       logger.info(`Keluarga Penderita ID: ${keluargaPenderitaId} has been found`);
  //       res.status(200).json({
  //           message: `Keluarga Penderita ID: ${keluargaPenderitaId} has been found`,
  //           data: keluargaPenderita, 
  //       });
  //     } else {
  //       logger.error({ message: 'Keluarga Penderita not found' })
  //       res.status(404).json({ message: 'Keluarga Penderita not found' });
  //     }
  //   } catch (error: any) {
  //     logger.error({ message: `Failed to get Keluarga Penderita: ${error.message}` })
  //     res.status(500).json({ message: `Failed to get Keluarga Penderita: ${error.message}` });
  //   }
  // }

  // async updateKeluargaPenderita(req: Request, res: Response): Promise<void> {
  //   try {
  //     const keluargaPenderitaId = parseInt(req.params.id);
  //     const { email, password, jenis_hubungan, nama_perwakilan, alamat_rumah_penderita } = req.body;
  //     const [updatedRows, updatedKeluargaPenderita] = await this.keluargaPenderitaService.updateKeluargaPenderita(keluargaPenderitaId, { 
  //       email, 
  //       password, 
  //       jenis_hubungan, 
  //       nama_perwakilan, 
  //       alamat_rumah_penderita 
  //     });
  //     if (!updatedKeluargaPenderita) {
  //       logger.error({ message: 'Keluarga Penderita not found' })
  //       res.status(404).json({ message: 'Keluarga Penderita not found' });
  //       return;
  //     }
  //     if (updatedRows === 0) {
  //       logger.error({ message: 'Keluarga Penderita not found' })
  //       res.status(404).json({ message: 'Keluarga Penderita not found' });
  //       return;
  //     } 
  //     logger.info(`Penderita ID: ${keluargaPenderitaId} has been updated`);
  //     res.status(200).json({
  //       message: `Penderita ID: ${keluargaPenderitaId} has been updated`,
  //       data: JSON.stringify(updatedKeluargaPenderita[0]), 
  //     });
  //   } catch (error: any) {
  //     logger.error({ message: `Failed to update Penderita: ${error.message}` })
  //     res.status(500).json({ message: `Failed to update Penderita: ${error.message}` });
  //   }
  // }

  // async deleteKeluargaPenderita(req: Request, res: Response): Promise<void> {
  //   try {
  //     const keluargaPenderitaId = parseInt(req.params.id);
  //     const deletedRows = await this.keluargaPenderitaService.deleteKeluargaPenderita(keluargaPenderitaId);
  //     if (deletedRows === 0) {
  //       logger.error({ message: 'Keluarga Penderita not found' });
  //       res.status(404).json({ message: 'Keluarga Penderita not found' });
  //       return;
  //     }
  //     logger.info(`Keluarga Penderita ID: ${keluargaPenderitaId} has been deleted`);
  //     res.status(200).json({
  //       message: `Keluarga Penderita ID: ${keluargaPenderitaId} has been deleted`, 
  //     });
  //     res.status(204).end()
  //   } catch (error: any) {
  //     logger.error({ message: `Failed to delete Keluarga Penderita: ${error.message}` });
  //     res.status(500).json({ message: `Failed to delete Keluarga Penderita: ${error.message}` });
  //   }
  // }
}

export default PatientFamilyDetailController;