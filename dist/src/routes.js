"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const auth_1 = require("./middleware/auth");
const auth_service_1 = __importDefault(require("./service/auth.service"));
const refreshToken_controller_1 = __importDefault(require("./controller/refreshToken.controller"));
const penderita_service_1 = __importDefault(require("./service/penderita.service"));
const detailPenderita_service_1 = __importDefault(require("./service/detailPenderita.service"));
const penderita_controller_1 = __importDefault(require("./controller/penderita.controller"));
const keluarga_service_1 = __importDefault(require("./service/keluarga.service"));
const detailKeluarga_service_1 = __importDefault(require("./service/detailKeluarga.service"));
const keluarga_controller_1 = __importDefault(require("./controller/keluarga.controller"));
const hubunganPenderita_service_1 = __importDefault(require("./service/hubunganPenderita.service"));
const riwayatPerjalanan_service_1 = __importDefault(require("./service/riwayatPerjalanan.service"));
const riwayatPerjalanan_controller_1 = __importDefault(require("./controller/riwayatPerjalanan.controller"));
// const demiWatchController = new DemiWatchController(new DemiWatchService(), new LogService());
// const deviceController = new DeviceController(new DeviceService(), new LogService());
const refreshTokenController = new refreshToken_controller_1.default(new auth_service_1.default());
const penderitaController = new penderita_controller_1.default(new penderita_service_1.default(), new detailPenderita_service_1.default(new penderita_service_1.default()), new hubunganPenderita_service_1.default(new keluarga_service_1.default(), new penderita_service_1.default(), new detailPenderita_service_1.default(new penderita_service_1.default()), new detailKeluarga_service_1.default(new keluarga_service_1.default())), new auth_service_1.default());
const keluargaController = new keluarga_controller_1.default(new keluarga_service_1.default(), new detailKeluarga_service_1.default(new keluarga_service_1.default()), new penderita_service_1.default(), new hubunganPenderita_service_1.default(new keluarga_service_1.default(), new penderita_service_1.default(), new detailPenderita_service_1.default(new penderita_service_1.default()), new detailKeluarga_service_1.default(new keluarga_service_1.default())), new auth_service_1.default());
const riwayatPerjalananController = new riwayatPerjalanan_controller_1.default(new penderita_service_1.default(), new hubunganPenderita_service_1.default(new keluarga_service_1.default(), new penderita_service_1.default(), new detailPenderita_service_1.default(new penderita_service_1.default()), new detailKeluarga_service_1.default(new keluarga_service_1.default())), new riwayatPerjalanan_service_1.default(new penderita_service_1.default()));
function routes(app) {
    // Test api
    app.get('/test', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.debug(`Full Request: ${req.body}`);
            res.status(201).json({ message: 'Test successfull' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    // Create New Access Token
    app.post('/api/token', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield refreshTokenController.refreshAccessToken(req, res);
        }
        catch (error) { }
    }));
    /* START PATIENT  ######################################################################################## */
    // UNAUTHORIZED ENDPOINT
    // Register Penderita Account
    app.post('/api/penderita/register', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield penderitaController.registerPenderitaAccount(req, res);
        }
        catch (error) { }
    }));
    // Login Penderita Account 
    app.post('/api/penderita/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield penderitaController.loginPenderitaAccount(req, res);
        }
        catch (error) { }
    }));
    // Get Penderita Full Profile
    app.get('/api/penderita/:username', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield penderitaController.getPenderitaProfile(req, res);
        }
        catch (error) { }
    }));
    // AUTHORIZED ENDPOINT
    // Update Any Keluarga Data By Keluarga Username 
    app.put('/api/penderita/:username', auth_1.authenticateJWT, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield penderitaController.updateDataPenderitaByPenderitaUsername(req, res);
        }
        catch (error) { }
    }));
    // Delete Keluarga Profile
    app.delete('/api/penderita/:username', auth_1.authenticateJWT, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield penderitaController.deletePenderitaAccount(req, res);
        }
        catch (error) { }
    }));
    /* END PATIENT  ########################################################################################## */
    /* START KELUARGA  ####################################################################################### */
    // UNAUTHORIZED ENDPOINT
    // Register Keluarga Account
    app.post('/api/keluarga/register', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield keluargaController.registerKeluargaAccount(req, res);
        }
        catch (error) { }
    }));
    // Login Keluarga Account 
    app.post('/api/keluarga/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield keluargaController.loginKeluargaAccount(req, res);
        }
        catch (error) { }
    }));
    // Get Keluarga Full Profile
    app.get('/api/keluarga/:username', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield keluargaController.getKeluargaProfile(req, res);
        }
        catch (error) { }
    }));
    // AUTHORIZED ENDPOINT
    // Create Penderita Connection By Penderita Username 
    app.post('/api/keluarga/:username', auth_1.authenticateJWT, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield keluargaController.createPenderitaConnectionByPenderitaUsername(req, res);
        }
        catch (error) { }
    }));
    // Get All Penderita By Penderita Incomplete Data
    app.get('/api/keluarga/:username/searchpenderita', auth_1.authenticateJWT, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield keluargaController.getAllPenderitaByImperfectDetailPenderitaData(req, res);
        }
        catch (error) { }
    }));
    // Create Penderita Connection By Penderita Incomplete Data
    app.post('/api/keluarga/:username/:penderita_username', auth_1.authenticateJWT, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield keluargaController.createPenderitaConnectionByPenderitaDetailData(req, res);
        }
        catch (error) { }
    }));
    // Update Any Keluarga Data By Keluarga Username 
    app.put('/api/keluarga/:username', auth_1.authenticateJWT, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield keluargaController.updateDataKeluargaByKeluargaUsername(req, res);
        }
        catch (error) { }
    }));
    // Delete Keluarga Profile
    app.delete('/api/keluarga/:username', auth_1.authenticateJWT, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield keluargaController.deleteKeluargaAccount(req, res);
        }
        catch (error) { }
    }));
    /* END KELUARGA  ######################################################################################### */
    /* START FITUR LOKASI  ################################################################################### */
    // UNAUTHORIZED ENDPOINT
    // Update New Lokasi Terakhir Penderita
    app.post('/api/penderita/:penderita_username/:riwayat_perjalanan_id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield riwayatPerjalananController.updateLokasiTerakhirByRiwayatPerjalanan(req, res);
        }
        catch (error) { }
    }));
    // Get Penderita 5 Last Location
    app.get('/api/penderita/:penderita_username/lastlocation', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield riwayatPerjalananController.getLimaLokasiTerakhirByPenderitaUsername(req, res);
        }
        catch (error) { }
    }));
    // Get All Riwayat Perjalanan Penderita Through Keluarga Account
    app.get('/api/keluarga/:keluarga_username/:penderita_username/riwayatperjalanan', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield riwayatPerjalananController.getAllRiwayatPerjalananByPenderitaUsername(req, res);
        }
        catch (error) { }
    }));
    // Get Specific Riwayat Perjalanan Penderita Through Keluarga Account
    app.get('/api/keluarga/:keluarga_username/:penderita_username/:riwayat_perjalanan_id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield riwayatPerjalananController.getSpecificRiwayatPerjalananPenderita(req, res);
        }
        catch (error) { }
    }));
    // AUTHORIZED ENDPOINT
    // Create Penderita Riwayat Perjalanan Through Keluarga Account
    app.post('/api/keluarga/:keluarga_username/:penderita_username/riwayatperjalanan', auth_1.authenticateJWT, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield riwayatPerjalananController.createNewRiwayatPerjalanan(req, res);
        }
        catch (error) { }
    }));
    /* END FITUR LOKASI  ##################################################################################### */
}
exports.default = routes;
