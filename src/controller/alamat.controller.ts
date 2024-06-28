import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import PenderitaService from '../service/penderita.service';
import HubunganPenderitaService from '../service/hubunganPenderita.service';
import AlamatService from '../service/alamat.service';

class AlamatController {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly hubunganPenderitaService: HubunganPenderitaService,
    private readonly alamatService : AlamatService,
  ) {} // Receives service as an argument

  // AUTHORIZED ENDPOINT
  async createNewAlamatTersimpan(req: Request, res: Response): Promise<void> {
    try {
      
        var alamatUUID = uuidv4();

        const { 
          penderita_username,
          keluarga_username } = req.params;

        const { 
          alamat,
          longitude,
          latitude } = req.body;

        const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
        // Check if the penderita was found
        if (!hubungan) {
          throw new Error('Penderita Account has not been connected to Keluarga Account');
        }

        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }

        const alamatTersimpan = await this.alamatService.createNewAlamatTersimpan({
          alamat_id: alamatUUID,
          penderita_id: penderita.penderita_id,
          alamat,
          longitude,
          latitude
        })
        logger.info(`ALAMAT TERSIMPAN created succesfully`);

        res.status(201).json({
          message: `ALAMAT TERSIMPAN for PENDERITA ${penderita_username} created successfully`,
          data: {
            alamat: alamatTersimpan,
          }, 
        })
      
    } catch (error: any) {
      logger.error({ message: `Failed to create ALAMAT TERSIMPAN for PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to create ALAMAT TERSIMPAN for PENDERITA: ${error.message}` });
    }
  }

  // UNAUTHORIZED ENDPOINT
  async getAllAlamatTersimpanByPenderitaUsername(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username,
        keluarga_username } = req.params;

      const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('Penderita Account has not been connected to Keluarga Account');
      }

      const alamat = await this.alamatService.getAllAlamatByPenderitaUsername( penderita_username )
      logger.info(`All ALAMAT TERSIMPAN PENDERITA: ${penderita_username} has been found`);
        res.status(200).json({
            message: `All ALAMAT TERSIMPAN PENDERITA: ${penderita_username} has been found`,
            data: alamat, 
        });
    } catch (error: any) {
      logger.error({ message: `Failed to get All ALAMAT PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to get All ALAMAT PENDERITA: ${error.message}` });
    }
  }

  // UNAUTHORIZED ENDPOINT
  async getSpecificAlamatByAlamatId(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username,
        keluarga_username,
        alamat_id } = req.params;

      const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('Penderita Account has not been connected to Keluarga Account');
      }

      const alamat = await this.alamatService.getSpecificAlamatByAlamatIdAndValidate(
        penderita_username,
        alamat_id
      )
      logger.info(`ALAMAT TERSIMPAN ID: ${alamat_id} for PENDERITA: ${penderita_username} has been found`);
        res.status(200).json({
            message: `ALAMAT TERSIMPAN ID: ${alamat_id} for PENDERITA: ${penderita_username} has been found`,
            data:alamat, 
        });
    } catch (error: any) {
      logger.error({ message: `Failed to get Specific ALAMAT TERSIMPAN PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to get Specific ALAMAT TERSIMPAN PENDERITA: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async updateSpecificAlamatByAlamatId(req: Request, res: Response): Promise<void> {
    try {
        
            const { 
                penderita_username,
                keluarga_username,
                alamat_id } = req.params;

            const { 
                alamat,
                longitude,
                latitude } = req.body;

            const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
            // Check if the penderita was found
            if (!hubungan) {
                throw new Error('Penderita Account has not been connected to Keluarga Account');
            }

            const [updatedRows, updatedAlamat] = await this.alamatService.updateAlamatByAlamatId(
                penderita_username, alamat_id, {
                alamat,
                longitude,
                latitude
            })

            logger.info(`Data ALAMAT TERSIMPAN: ${alamat_id} for PENDERITA: ${penderita_username} has been updated`);
            res.status(200).json({
                message: `Data ALAMAT TERSIMPAN: ${alamat_id} for PENDERITA: ${penderita_username} has been updated`,
                data: JSON.stringify(updatedAlamat), 
            });
        
    } catch (error: any) {
      logger.error({ message: `Failed to update data ALAMAT TERSIMPAN for PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to update data ALAMAT TERSIMPAN for PENDERITA: ${error.message}` });
    }
  }

  // AUTHORIZED ENDPOINT
  async deleteAlamatTersimpan(req: Request, res: Response): Promise<void> {
    try {
      
        const { 
            penderita_username,
            keluarga_username,
            alamat_id } = req.params;
        const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
        // Check if the penderita was found
        if (!hubungan) {
            throw new Error('Penderita Account has not been connected to Keluarga Account');
        }
        const deleteRows = await this.alamatService.deleteAlamatByAlamatId(penderita_username, alamat_id)
        if (deleteRows === 0) {
          logger.error({ message: 'PENDERITA Account not found' })
          res.status(404).json({ message: 'PENDERITA Account not found' });
          return;
        }
        logger.info(`ALAMAT TERSIMPAN ID: ${alamat_id} has been deleted`);

        res.status(200).json({
          message: `ALAMAT TERSIMPAN ID: ${alamat_id} has been deleted`,
        });
        res.status(204).end()
      
    } catch (error: any) {
      logger.error({ message: `Failed to delete ALAMAT TERSIMPAN ID: ${error.message}` })
      res.status(500).json({ message: `Failed to delete ALAMAT TERSIMPAN ID: ${error.message}` });
    }
  }

}

export default AlamatController;