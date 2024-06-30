import { Request, Response } from 'express';
import logger from "../utils/logger";
import { v4 as uuidv4 } from 'uuid'; 
import PenderitaService from '../service/penderita.service';
import HubunganPenderitaService from '../service/hubunganPenderita.service';
import RiwayatPerjalananService from '../service/riwayatPerjalanan.service';
import EmergensiService from '../service/emergensi.service';
import NotifikasiService from '../service/notifikasi.service';

class RiwayatPerjalananController {

  constructor(
    private readonly penderitaService: PenderitaService,
    private readonly hubunganPenderitaService: HubunganPenderitaService,
    private readonly riwayatPerjalananService : RiwayatPerjalananService,
    private readonly emergensiService : EmergensiService,
    private readonly notifikasiService : NotifikasiService,
  ) {} // Receives service as an argument

  async createNewRiwayatPerjalanan(req: Request, res: Response): Promise<void> {
    try {
      
        var riwayatUUID = uuidv4();
        var lokasiAwalUUID = uuidv4();
        var lokasiTerakhirUUID = uuidv4();
        var lokasiTujuanUUID = uuidv4();

        const { 
          penderita_username } = req.params;

        const { 
          alamat_awal,
          longitude_awal,
          latitude_awal,
          longitude_terakhir,
          latitude_terakhir,
          alamat_tujuan,
          longitude_tujuan,
          latitude_tujuan } = req.body;

        const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByPenderitaUsername(penderita_username)
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
      
    } catch (error: any) {
      logger.error({ message: `Failed to create RIWAYAT PERJALANAN dan DETAIL LOKASI for PENDERITA: ${error.message}` })
      res.status(500).json({ message: `Failed to create RIWAYAT PERJALANAN dan DETAIL LOKASI for PENDERITA: ${error.message}` });
    }
  }

  async getLokasiTerakhirByPenderitaUsername(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username } = req.params;

      const lokasi = await this.riwayatPerjalananService.getLokasiTerakhirByPenderitaUsername( penderita_username )
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

  async getLastRiwayatPerjalananByPenderitaUsername(req: Request, res: Response): Promise<void> {
    try {
      const { 
        penderita_username } = req.params;

      const hubungan = await this.hubunganPenderitaService.getHubunganPenderitaByPenderitaUsername(penderita_username)
      // Check if the penderita was found
      if (!hubungan) {
        throw new Error('Penderita Account has not been connected to Keluarga Account');
      }

      const riwayat = await this.riwayatPerjalananService.getKelompokLokasiByLastRiwayatPerjalananPenderita( penderita_username )
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

  async updateLokasiTerakhirByRiwayatPerjalananTerakhirOrSelesaiOrEmergensi(req: Request, res: Response): Promise<void> {
    try {
      const lokasiTerakhirUUID = uuidv4();
      const emergensiUUID = uuidv4();
      const notifikasiUUID = uuidv4();

      const { 
        penderita_username } = req.params;

      const { 
        longitude_terakhir,
        latitude_terakhir } = req.body;

      const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(penderita_username)
      // Check if the penderita was found
      if (!penderita) {
        throw new Error('Penderita Account not found');
      }

      const riwayat =  await this.riwayatPerjalananService.getRiwayatPerjalananPenderitaTerakhir(penderita_username)
      // Check if the latest riwayat Perjalanan penderita was found
      if (!riwayat) {
        throw new Error('Riwayat Perjalanan Penderita not found');
      }

      const lokasi = await this.riwayatPerjalananService.createLokasiTerakhir({
        lokasi_terakhir_id: lokasiTerakhirUUID,
        riwayat_perjalanan_id: riwayat.riwayat_perjalanan_id,
        longitude_terakhir,
        latitude_terakhir
      })
      logger.info(`New Lokasi Terakhir updated succesfully`);

      const jarak_terhadap_lokasi_tujuan = await this.riwayatPerjalananService.getJarakLokasiTerakhirDenganLokasiTujuan(penderita_username);

      const jarak_terhadap_lokasi_awal = await this.riwayatPerjalananService.getJarakLokasiTerakhirDenganLokasiAwal(penderita_username);
      const jarak_max = await this.riwayatPerjalananService.getJarakMaxLokasiAwalDenganLokasiTujuan(penderita_username);
      const jarak_max_safe = jarak_max * 2;
      logger.info(`Jarak Safe Maksimum Penderita: ${jarak_max_safe}`)

      const jarak_jumlah_kuadrat_arr = jarak_terhadap_lokasi_tujuan.map((tujuan) => {
        return jarak_terhadap_lokasi_awal.map((awal) => {
          return ((awal) + (tujuan));
        })
      })

      const jarak_jumlah_kuadrat_list = jarak_jumlah_kuadrat_arr.flat();
      logger.info(`Jumlah Jarak Kuadrat Maksimum: ${Math.max(...jarak_jumlah_kuadrat_list)}`)
      const is_tersesat_list = jarak_jumlah_kuadrat_list.map((jarak) => {
        if ( jarak > jarak_max_safe ) {
          return true;
        }
        return false;
      })

      // Menggunakan metode .some() untuk mengecek apakah ada elemen yang true
      const any_tersesat = is_tersesat_list.some(element => element === true);
      if (any_tersesat) {
        const [updatedRows, updatedStatusRiwayat] = await this.riwayatPerjalananService.updateRiwayatPerjalananPenderitaTerakhirStatus(penderita_username, {
          status: "TERSESAT"
        })
        if (!updatedStatusRiwayat) {
          logger.error({ message: 'PENDERITA Account not found' })
          res.status(404).json({ message: 'PENDERITA Account not found' });
          return;
        }
        if (updatedRows === 0) {
          logger.error({ message: 'PENDERITA Account not found' })
          res.status(404).json({ message: 'PENDERITA Account not found' });
          return;
        }
        logger.info(`Status RIWAYAT DETAK JANTUNG PENDERITA: ${penderita_username} has been updated to TERSESAT`);

        const tersesatSOS = await this.emergensiService.createNewAutomatedEmergensi({
          emergensi_id: emergensiUUID,
          penderita_id: penderita.penderita_id,
          bpm_sepuluh_menit_terakhir: null,
          jarak_tersesat: Math.max(...jarak_terhadap_lokasi_tujuan),
          emergensi_button: null,
          nilai_accelerometer: null,
        })
        logger.info(`EMERGENCY! PENDERITA ${penderita_username} is TERSESAT`);

        const notifikasi = await this.notifikasiService.createNewNotifikasi(penderita_username, {
          notifikasi_id: notifikasiUUID,
          emergensi_id: emergensiUUID,
          tipe: 'PENDERITA TERSESAT',
          pesan: `EMERGENCY! PENDERITA ${penderita_username} is TERSESAT`,
          timestamp: tersesatSOS.timestamp
        })
        logger.info(`NOTIFIKASI has Successfully created`);

        const riwayatUpdated = await this.riwayatPerjalananService.getRiwayatPerjalananPenderitaTerakhir(penderita_username)
        res.status(201).json({
          message: `EMERGENCY! PENDERITA ${penderita_username} is TERSESAT`,
          data: {
            notifikasi: notifikasi,
            emergensi: tersesatSOS,
            riwayat: riwayatUpdated,
            lokasiTerakhir: lokasi
          }
        })
        return;
      }

      const is_finished_list = jarak_terhadap_lokasi_tujuan.map((jarak) => {
        if ((jarak >= 0) && (jarak <= 10)){
          return true;
        }
        return false;
      })

      // Menggunakan metode .every() untuk mengecek apakah semua elemen adalah true
      const all_finished = is_finished_list.every(element => element === true);
      if (all_finished) {
        const [updatedRows, updatedStatus] = await this.riwayatPerjalananService.updateRiwayatPerjalananPenderitaTerakhirStatus(penderita_username, {
          status: "SELESAI"
        })
        if (!updatedStatus) {
          logger.error({ message: 'PENDERITA Account not found' })
          res.status(404).json({ message: 'PENDERITA Account not found' });
          return;
        }
        if (updatedRows === 0) {
          logger.error({ message: 'PENDERITA Account not found' })
          res.status(404).json({ message: 'PENDERITA Account not found' });
          return;
        }
        logger.info(`Status RIWAYAT PERJALANAN TERBARU PENDERITA: ${penderita_username} has been updated to SELESAI`);

        const riwayatUpdated = await this.riwayatPerjalananService.getRiwayatPerjalananByRiwayatPerjalananId(riwayat.riwayat_perjalanan_id)

        res.status(200).json({
          message: `Status RIWAYAT PERJALANAN TERBARU PENDERITA: ${penderita_username} has been updated to SELESAI`,
          data:riwayatUpdated, 
        });       
        return; 
      }

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