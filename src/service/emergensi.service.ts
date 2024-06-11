import Emergensi from '../models/emergensi.model';
import PenderitaService from './penderita.service';

class EmergensiService {

  constructor(
    private readonly penderitaService: PenderitaService,
  ) {} // Receives service as an argument

  async createNewAutomatedEmergensi(data: {
    emergensi_id: string;
    penderita_id: string;
    bpm_sepuluh_menit_terakhir: number | null;
    jarak_tersesat: Float32Array | null;
    emergensi_button: null;
    nilai_accelerometer: null;
  }): Promise<Emergensi> {
    try {
      // Filter out null properties
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
      );
      const emergensi = await Emergensi.create(filteredData);
      return emergensi;
    } catch (error) {
      throw new Error(`Failed to create new Automated Emergensi: ${error}`);
    }
  }

  async createNewManualEmergensi(username: string, data: {
    emergency_id: string;
    bpm_sepuluh_menit_terakhir: null;
    jarak_tersesat: null;
    emergensi_button: boolean | null;
    nilai_accelerometer: Float32Array | null;
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
            bpm_sepuluh_menit_terakhir: data.bpm_sepuluh_menit_terakhir,
            jarak_tersesat: data.jarak_tersesat,
            emergensi_button: data.emergensi_button,
            nilai_accelerometer: data.nilai_accelerometer
        }
        // Filter out null properties
        const filteredData = Object.fromEntries(
            Object.entries(newData).filter(([_, v]) => v !== null)
          );
        const emergensi = await Emergensi.create(filteredData);
        return emergensi;
    } catch (error) {
      throw new Error(`Failed to create new Manual Emergensi: ${error}`);
    }
  }

}

export default EmergensiService;