import { Express, Request, Response } from "express";
import logger from "./utils/logger";
import { authenticateJWT } from './middleware/auth';
import AuthService from "./service/auth.service";
import RefreshTokenController from "./controller/refreshToken.controller";
import PenderitaService from './service/penderita.service';
import DetailPenderitaService from './service/detailPenderita.service';
import PenderitaController from "./controller/penderita.controller";
import KeluargaService from './service/keluarga.service';
import DetailKeluargaService from './service/detailKeluarga.service';
import KeluargaController from "./controller/keluarga.controller";
import HubunganPenderitaService from "./service/hubunganPenderita.service";
import RiwayatPerjalananService from "./service/riwayatPerjalanan.service";
import RiwayatPerjalananController from "./controller/riwayatPerjalanan.controller";

// const demiWatchController = new DemiWatchController(new DemiWatchService(), new LogService());
// const deviceController = new DeviceController(new DeviceService(), new LogService());


const refreshTokenController = new RefreshTokenController(
  new AuthService()
)

const penderitaController = new PenderitaController(
  new PenderitaService(),
  new DetailPenderitaService(
    new PenderitaService(),
  ),
  new HubunganPenderitaService(
    new KeluargaService(),
    new PenderitaService(),
    new DetailPenderitaService(
      new PenderitaService(),
    ),
    new DetailKeluargaService(
      new KeluargaService(),
    )
  ),
  new AuthService()
);

const keluargaController = new KeluargaController(
  new KeluargaService(),
  new DetailKeluargaService(
    new KeluargaService(),
  ),
  new PenderitaService(),
  new HubunganPenderitaService(
    new KeluargaService(),
    new PenderitaService(),
    new DetailPenderitaService(
      new PenderitaService(),
    ),
    new DetailKeluargaService(
      new KeluargaService(),
    )
  ),
  new AuthService()
);

const riwayatPerjalananController = new RiwayatPerjalananController(
  new PenderitaService(),
  new HubunganPenderitaService(
    new KeluargaService(),
    new PenderitaService(),
    new DetailPenderitaService(
      new PenderitaService(),
    ),
    new DetailKeluargaService(
      new KeluargaService(),
    )
  ),
  new RiwayatPerjalananService(
    new PenderitaService()
  )
)

function routes(app: Express){
  // Test api
  app.get('/test', async (req: Request, res: Response) => {
    try {
      logger.debug(`Full Request: ${req.body}`);
      res.status(201).json({ message: 'Test successfull' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Create New Access Token
  app.post('/api/token', async (req: Request, res: Response) => {
    try { await refreshTokenController.refreshAccessToken(req, res) } catch (error: any) { }
  });

  /* START PATIENT  ######################################################################################## */

  // UNAUTHORIZED ENDPOINT
  // Register Penderita Account
  app.post('/api/penderita/register', async (req: Request, res: Response) => {
    try { await penderitaController.registerPenderitaAccount(req, res) } catch (error: any) { }
  });

  // Login Penderita Account 
  app.post('/api/penderita/login', async (req: Request, res: Response) => {
    try { await penderitaController.loginPenderitaAccount(req, res) } catch (error: any) { }
  });

  // Get Penderita Full Profile
  app.get('/api/penderita/:username', async (req: Request, res: Response) => {
    try { await penderitaController.getPenderitaProfile(req, res) } catch (error: any) { }
  });

  // AUTHORIZED ENDPOINT
  // Update Any Keluarga Data By Keluarga Username 
  app.put('/api/penderita/:username', authenticateJWT, async (req: Request, res: Response) => {
    try { await penderitaController.updateDataPenderitaByPenderitaUsername(req, res) } catch (error: any) { }
  });

  // Delete Keluarga Profile
  app.delete('/api/penderita/:username', authenticateJWT, async (req: Request, res: Response) => {
    try { await penderitaController.deletePenderitaAccount(req, res) } catch (error: any) { }
  });

  /* END PATIENT  ########################################################################################## */

  /* START KELUARGA  ####################################################################################### */

  // UNAUTHORIZED ENDPOINT
  // Register Keluarga Account
  app.post('/api/keluarga/register', async (req: Request, res: Response) => {
    try { await keluargaController.registerKeluargaAccount(req, res) } catch (error: any) { }
  });

  // Login Keluarga Account 
  app.post('/api/keluarga/login', async (req: Request, res: Response) => {
    try { await keluargaController.loginKeluargaAccount(req, res) } catch (error: any) { }
  });

  // Get Keluarga Full Profile
  app.get('/api/keluarga/:username', async (req: Request, res: Response) => {
    try { await keluargaController.getKeluargaProfile(req, res) } catch (error: any) { }
  });

  // AUTHORIZED ENDPOINT
  // Create Penderita Connection By Penderita Username 
  app.post('/api/keluarga/:username', authenticateJWT, async (req: Request, res: Response) => {
    try { await keluargaController.createPenderitaConnectionByPenderitaUsername(req, res) } catch (error: any) { }
  });

  // Get All Penderita By Penderita Incomplete Data
  app.get('/api/keluarga/:username/searchpenderita', authenticateJWT, async (req: Request, res: Response) => {
    try { await keluargaController.getAllPenderitaByImperfectDetailPenderitaData(req, res) } catch (error: any) { }
  });

  // Create Penderita Connection By Penderita Incomplete Data
  app.post('/api/keluarga/:username/:penderita_username', authenticateJWT, async (req: Request, res: Response) => {
    try { await keluargaController.createPenderitaConnectionByPenderitaDetailData(req, res) } catch (error: any) { }
  });

  // Update Any Keluarga Data By Keluarga Username 
  app.put('/api/keluarga/:username', authenticateJWT, async (req: Request, res: Response) => {
    try { await keluargaController.updateDataKeluargaByKeluargaUsername(req, res) } catch (error: any) { }
  });

  // Delete Keluarga Profile
  app.delete('/api/keluarga/:username', authenticateJWT, async (req: Request, res: Response) => {
    try { await keluargaController.deleteKeluargaAccount(req, res) } catch (error: any) { }
  });

  /* END KELUARGA  ######################################################################################### */

  /* START FITUR LOKASI  ################################################################################### */
  
  // UNAUTHORIZED ENDPOINT
  // Update New Lokasi Terakhir Penderita
  app.post('/api/penderita/:penderita_username/:riwayat_perjalanan_id', async (req: Request, res: Response) => {
    try { await riwayatPerjalananController.updateLokasiTerakhirByRiwayatPerjalanan(req, res) } catch (error: any) { }
  });

  // Get Penderita 5 Last Location
  app.get('/api/penderita/:penderita_username/lastlocation', async (req: Request, res: Response) => {
    try { await riwayatPerjalananController.getLimaLokasiTerakhirByPenderitaUsername(req, res) } catch (error: any) { }
  });

  // Get All Riwayat Perjalanan Penderita Through Keluarga Account
  app.get('/api/keluarga/:keluarga_username/:penderita_username/riwayatperjalanan', async (req: Request, res: Response) => {
    try { await riwayatPerjalananController.getAllRiwayatPerjalananByPenderitaUsername(req, res) } catch (error: any) { }
  });

  // Get Specific Riwayat Perjalanan Penderita Through Keluarga Account
  app.get('/api/keluarga/:keluarga_username/:penderita_username/:riwayat_perjalanan_id', async (req: Request, res: Response) => {
    try { await riwayatPerjalananController.getSpecificRiwayatPerjalananPenderita(req, res) } catch (error: any) { }
  });

  // AUTHORIZED ENDPOINT
  // Create Penderita Riwayat Perjalanan Through Keluarga Account
  app.post('/api/keluarga/:keluarga_username/:penderita_username/riwayatperjalanan', authenticateJWT, async (req: Request, res: Response) => {
    try { await riwayatPerjalananController.createNewRiwayatPerjalanan(req, res) } catch (error: any) { }
  });

  /* END FITUR LOKASI  ##################################################################################### */

}

export default routes;