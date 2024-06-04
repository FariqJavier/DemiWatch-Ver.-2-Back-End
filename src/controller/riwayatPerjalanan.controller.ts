import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import PenderitaService from '../service/penderita.service';
import HubunganPenderitaService from '../service/hubunganPenderita.service';
import RiwayatPerjalananService from '../service/riwayatPerjalanan.service';

class RiwayatPerjalananController {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly hubunganPenderitaService: HubunganPenderitaService,
    private readonly riwayatPerjalananService : RiwayatPerjalananService,
  ) {} // Receives service as an argument

  async createNewRiwayatPerjalanan(req: Request, res: Response): Promise<void> {
    try {
      if ((req as any).user) {
        var riwayatUUID = uuidv4();
        var lokasiAwalUUID = uuidv4();
        var lokasiTerakhirUUID = uuidv4();
        var lokasiTujuanUUID = uuidv4();

        const { 
          penderita_username,
          keluarga_username } = req.params;

        const { 
          alamat_awal,
          longitude_awal,
          latitude_awal,
          longitude_terakhir,
          latitude_terakhir,
          alamat_tujuan,
          longitude_tujuan,
          latitude_tujuan } = req.body;

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

        const riwayat = await this.riwayatPerjalananService.createRiwayatPerjalanan({
          riwayat_perjalanan_id: riwayatUUID,
          penderita_id: penderita.penderita_id
        })
        logger.info(`Riwayat Perjalanan created succesfully`);

        const lokasiAwal = await this.riwayatPerjalananService.createLokasiAwal({
          lokasi_awal_id: lokasiAwalUUID,
          riwayat_perjalanan_id: riwayatUUID,
          alamat_awal,
          longitude_awal,
          latitude_awal
        })
        logger.info(`Lokasi Awal created succesfully`);

        const lokasiTerakhir = await this.riwayatPerjalananService.createLokasiTerakhir({
          lokasi_terakhir_id: lokasiTerakhirUUID,
          riwayat_perjalanan_id: riwayatUUID,
          longitude_terakhir,
          latitude_terakhir
        })
        logger.info(`Lokasi Terakhir created succesfully`);

        const lokasiTujuan = await this.riwayatPerjalananService.createLokasiTujuan({
          lokasi_tujuan_id: lokasiTujuanUUID,
          riwayat_perjalanan_id: riwayatUUID,
          alamat_tujuan,
          longitude_tujuan,
          latitude_tujuan
        })
        logger.info(`Lokasi Tujuan created succesfully`);

        res.status(201).json({
          message: `RIWAYAT PERJALANAN dan DETAIL LOKASI for PENDERITA ${penderita_username} created successfully`,
          data: {
            riwayatPerjalanan: riwayat,
            lokasiAwal: lokasiAwal,
            lokasiTerakhir: lokasiTerakhir,
            lokasiTujuan: lokasiTujuan
          }, 
        })
      }
    } catch (error: any) {
      logger.error({ message: `Failed to create RIWAYAT PERJALANAN dan DETAIL LOKASI for PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to create RIWAYAT PERJALANAN dan DETAIL LOKASI for PENDERITA: ${error.message}` });
    }
  }

  async getLimaLokasiTerakhirByPenderitaUsername(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username } = req.params;

      const lokasi = await this.riwayatPerjalananService.getLimaLokasiTerakhirByPenderitaUsername( penderita_username )
      logger.info(`Lima LOKASI TERAKHIR PENDERITA ${penderita_username} has been found`);
        res.status(200).json({
            message: `Lima LOKASI TERAKHIR PENDERITA ${penderita_username} has been found`,
            data: lokasi, 
        });
    } catch (error: any) {
      logger.error({ message: `Failed to get Lima LOKASI TERAKHIR PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to get Lima LOKASI TERAKHIR PENDERITA: ${error.message}` });
    }
  }

  async getAllRiwayatPerjalananByPenderitaUsername(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username,
        keluarga_username } = req.params;

      const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('Penderita Account has not been connected to Keluarga Account');
      }

      const riwayat = await this.riwayatPerjalananService.getKelompokLokasiByEveryRiwayatPerjalananPenderita( penderita_username )
      logger.info(`All RIWAYAT PERJALANAN PENDERITA: ${penderita_username} has been found`);
        res.status(200).json({
            message: `All RIWAYAT PERJALANAN PENDERITA: ${penderita_username} has been found`,
            data:riwayat, 
        });
    } catch (error: any) {
      logger.error({ message: `Failed to get All RIWAYAT PERJALANAN PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to get All RIWAYAT PERJALANAN PENDERITA: ${error.message}` });
    }
  }

  async getSpecificRiwayatPerjalananPenderita(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username,
        keluarga_username,
        riwayat_perjalanan_id } = req.params;

      const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByKeluargaUsername(keluarga_username)
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('Penderita Account has not been connected to Keluarga Account');
      }

      const riwayat = await this.riwayatPerjalananService.getKelompokLokasiBySpecificRiwayatPerjalananPenderita(
        penderita_username,
        riwayat_perjalanan_id
      )
      logger.info(`RIWAYAT PERJALANAN ID: ${riwayat_perjalanan_id} for PENDERITA: ${penderita_username} has been found`);
        res.status(200).json({
            message: `RIWAYAT PERJALANAN ID: ${riwayat_perjalanan_id} for PENDERITA: ${penderita_username} has been found`,
            data:riwayat, 
        });
    } catch (error: any) {
      logger.error({ message: `Failed to get Specific RIWAYAT PERJALANAN PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to get Specific RIWAYAT PERJALANAN PENDERITA: ${error.message}` });
    }
  }

  async updateLokasiTerakhirByRiwayatPerjalanan(req: Request, res: Response): Promise<void> {
    try {
      const lokasiTerakhirUUID = uuidv4();

      const { 
        penderita_username,
        riwayat_perjalanan_id } = req.params;

      const { 
        longitude_terakhir,
        latitude_terakhir } = req.body;

      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }

      const lokasi = await this.riwayatPerjalananService.createLokasiTerakhir({
        lokasi_terakhir_id: lokasiTerakhirUUID,
        riwayat_perjalanan_id,
        longitude_terakhir,
        latitude_terakhir
      })
      logger.info(`New Lokasi Terakhir updated succesfully`);
      res.status(200).json({
          message: `New LOKASI TERAKHIR for RIWAYAT PERJALANAN PENDERITA ${penderita_username} updated successfully`,
          data:lokasi, 
      });
    } catch (error: any) {
      logger.error({ message: `Failed to update New LOKASI TERAKHIR for RIWAYAT PERJALANAN PENDERITA ${error.message}` })
      res.status(500).json({ message: `Failed to update New LOKASI TERAKHIR for RIWAYAT PERJALANAN PENDERITA: ${error.message}` });
    }
  }
}

export default RiwayatPerjalananController;