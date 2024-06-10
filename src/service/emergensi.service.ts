import Emergensi from '../models/emergensi.model';
import PenderitaService from './penderita.service';

class EmergensiService {

  constructor(
    private readonly penderitaService: PenderitaService,
  ) {} // Receives service as an argument

  async createNewAutomatedEmergensi(data: {
    emergency_id: string;
    penderita_id: string;
    bpm_sepuluh_menit_terakhir: Int16Array;
    jarak_tersesat: Float32Array;
  }): Promise<Emergensi> {
    try {
      const emergensi = await Emergensi.create(data);
      return emergensi;
    } catch (error) {
      throw new Error(`Failed to create new Automated Emergensi: ${error}`);
    }
  }

  async createNewManualEmergensi(username: string, data: {
    emergency_id: string;
    emergensi_button: boolean;
    nilai_accelerometer: Float32Array;
  }): Promise<Emergensi> {
    try {
        const penderita = await this.penderitaService.getPenderitaByPenderitaUsername(username)
        // Check if the penderita was found
        if (!penderita) {
          throw new Error('Penderita Account not found');
        }
        const newData = {
            emergency_id: data.emergency_id,
            penderita_id: penderita.penderita_id,
            emergensi_button: data.emergensi_button,
            nilai_accelerometer: data.nilai_accelerometer
        }
        const emergensi = await Emergensi.create(newData);
        return emergensi;
    } catch (error) {
      throw new Error(`Failed to create new Manual Emergensi: ${error}`);
    }
  }

}

export default EmergensiService;