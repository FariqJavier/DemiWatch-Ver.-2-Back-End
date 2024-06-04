import Keluarga from '../models/keluarga.model';

class KeluargaService {

  async createKeluarga(data: {
    keluarga_id: string;
    username: string;
    password: string;
  }): Promise<Keluarga> {
    try {
      const keluarga = await Keluarga.create(data);
      return keluarga;
    } catch (error) {
      throw new Error(`Failed to create Keluarga Account: ${error}`);
    }
  }

  async getKeluargaByKeluargaUsername(username: string): Promise<Keluarga | null> {
    try {
      const keluarga = await Keluarga.findOne({
        where: { username: username }
      });
      return keluarga;
    } catch (error) {
      throw new Error(`Failed to get Keluarga Account: ${error}`);
    }
  }

  async updateKeluargaByKeluargaUsername(username: string, data: {
    username?: string | null;
    password?: string | null;
  }): Promise<[number, Keluarga[]]> {
    try {
      // Filter out null properties
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
      );
      const keluarga = await this.getKeluargaByKeluargaUsername(username);
      // Check if the Keluarga was found
      if (!keluarga) {
        throw new Error('Keluarga Account not found');
      }
      const [updatedRows, updatedKeluarga] = await Keluarga.update(filteredData, {
        where: { 
          keluarga_id: keluarga.keluarga_id
        },
        returning: true,
      });
      return [updatedRows, updatedKeluarga];
    } catch (error) {
      throw new Error(`Failed to update Keluarga Account: ${error}`);
    }
  }

  async deleteKeluargaByKeluargaUsername(username: string): Promise<number> {
    try {
      const keluarga = await this.getKeluargaByKeluargaUsername(username)
      // Check if the keluarga was found
      if (!keluarga) {
        throw new Error('Keluarga Account not found');
      }
      const deletedRows = await Keluarga.destroy({ 
        where: { keluarga_id: keluarga.keluarga_id } 
      });
      return deletedRows;
    } catch (error) {
      throw new Error(`Failed to delete Keluarga Account: ${error}`);
    }
  }

//   async createPatientConnectionByPatientId(id: string, data: {
//     patient_detail_id: string;
//     patient_id: string;
//   }): Promise<PatientDetail> {
//     try {
//       const patient = await PatientDetail.create({
//         patient_detail_id: data.patient_detail_id,
//         patient_family_id: id,
//         patient_id: data.patient_id,
//       })
//       return patient;
//     } catch (error) {
//       throw new Error(`Failed to create Patient Connection: ${error}`);
//     }
//   }

//   async createInitialDeviceFamilyConnection(id: string, data: {
//     device_family_detail_id: string;
//     device_family_id: string;
//   }): Promise<DeviceFamilyDetail> {
//     try {
//       const deviceFamily = await DeviceFamilyDetail.create({
//         device_family_detail_id: data.device_family_detail_id,
//         patient_family_id: id,
//         device_family_id: data.device_family_id,
//       })
//       return deviceFamily;
//     } catch (error) {
//       throw new Error(`Failed to create Device Family Connection: ${error}`);
//     }
//   }

//   async getPatientFamilyById(id: string): Promise<PatientFamily | null> {
//     try {
//       const patientFamily = await PatientFamily.findByPk(id);
//       return patientFamily;
//     } catch (error) {
//       throw new Error(`Failed to get PatientFamily ID: ${error}`);
//     }
//   }

//   async updateDataPatientFamilyById(id: string, data: {
//     email?: string | null;
//     username?: string | null;
//     password?: string | null;
//   }): Promise<[number, PatientFamily[]]> {
//     try {
//       // Filter out null properties
//       const filteredData = Object.fromEntries(
//         Object.entries(data).filter(([_, v]) => v !== null)
//       );

//       const [updatedRows, updatedPatientFamily] = await PatientFamily.update(filteredData, {
//         where: { 
//           patient_family_id: id 
//         },
//         returning: true,
//       });
//       return [updatedRows, updatedPatientFamily];
//     } catch (error) {
//       throw new Error(`Failed to update PatientFamily ID: ${error}`);
//     }
//   }

//   async deletePatientFamilyById(id: string): Promise<number> {
//     try {
//       const deletedRows = await PatientFamily.destroy({ where: { patient_family_id: id } });
//       return deletedRows;
//     } catch (error) {
//       throw new Error(`Failed to delete PatientFamily ID: ${error}`);
//     }
//   }
}

export default KeluargaService;