import Penderita from '../models/penderita.model';
import PatientFamily from '../models/keluarga.model';
import bcrypt from 'bcrypt'
import { signJwt } from '../utils/jwt.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config/custom-environment-variables'
// import DeviceFamilyDetail from '../models/detailKeluarga.model';
// import DeviceFamily from '../models/deviceFamily.model';
import Keluarga from '../models/keluarga.model';

const { Op } = require('sequelize');

class AuthService {

  async validatePenderitaAccount(username: string, password: string): Promise<any> {
    try {
      const penderita = await Penderita.findOne({
        where: {
          [Op.or]: [
            { username: username },
          ]
        }
      });
  
      if (penderita && await bcrypt.compare(password, penderita.password)) {

        const payload = { 
          id: penderita.penderita_id, 
          username: penderita.username,
        };
        const accessToken = signJwt(payload, 'accessTokenPrivateKey', { expiresIn: '1h' });
        const refreshToken = signJwt(payload, 'refreshTokenPrivateKey', { expiresIn: '7d' });

        await penderita.update({ refreshToken });

        return { 
          id: penderita.penderita_id, 
          username: penderita.username, 
          accessToken, 
          refreshToken 
        };
      }
    } catch (error: any) {
      throw new Error(`Failed to validate PENDERITA Account: ${error}`);
    }
  }

  async validateKeluargaAccount(username: string, password: string): Promise<any> {
    try {
        const keluarga = await Keluarga.findOne({
          where: {
            [Op.or]: [
              { username: username },
            ]
          }
        });
  
        if (keluarga && await bcrypt.compare(password, keluarga.password)) {

          const payload = { 
            id: keluarga.keluarga_id, 
            username: keluarga.username,
          };
          const accessToken = signJwt(payload, 'accessTokenPrivateKey', { expiresIn: '1h' });
          const refreshToken = signJwt(payload, 'refreshTokenPrivateKey', { expiresIn: '7d' });

          await keluarga.update({ refreshToken });

          return { 
            id: keluarga.keluarga_id, 
            username: keluarga.username, 
            accessToken, 
            refreshToken 
          };
        }
      } catch (error: any) {
        throw new Error(`Failed to validate KELUARGA ACCOUNT: ${error}`);
      }
  }

  // async validateRelatedDeviceFamilyMacAddress(patient_family_id: string, mac_address_hex: string) {
  //   try {
  //     const relatedDeviceFamily = await DeviceFamilyDetail.findAll({ 
  //       where: {patient_family_id: patient_family_id} 
  //     });

  //     const deviceFamilyIds = relatedDeviceFamily.map(device => device.device_family_id);

  //     // Ambil semua detail perangkat yang sesuai dengan device family IDs
  //     const deviceFamilyDetails = await DeviceFamily.findAll({
  //       where: {
  //         device_family_id: deviceFamilyIds
  //       }
  //     });

  //     // Buat mapping dari device family ID ke MAC address
  //     const deviceFamilyMap = new Map(deviceFamilyDetails.map(device => [device.device_family_id, device.mac_address_hex]));

  //     // Validasi apakah setiap related device memiliki MAC address yang cocok
  //     for (const relatedDevice of relatedDeviceFamily) {
  //       const deviceId = relatedDevice.device_family_id;
  //       const deviceMacAddress = deviceFamilyMap.get(deviceId);

  //       if (!deviceMacAddress && deviceMacAddress != mac_address_hex) {
  //         return false;
  //       }
  //     }

  //     // for (const relatedDevice of relatedDeviceFamily){
  //     //   const deviceId = relatedDevice.device_family_id;
  //     //   const deviceFamilyDetail = await DeviceFamily.findOne({ 
  //     //     where: { device_family_id: deviceId } 
  //     //   });
  //     //   if (!deviceFamilyDetail || deviceFamilyDetail.mac_address_hex !== mac_address_hex) {
  //     //     return false
  //     //   }
  //     // }
      
  //     return true;
  //   } catch (error: any) {
  //     throw new Error(`Failed to validate MAC Address Patient Family: ${error}`);
  //   }
  // };

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, Buffer.from(config.refreshTokenPublicKey, 'base64').toString('ascii')) as JwtPayload;
      const newAccessToken = signJwt({ id: payload.id, username: payload.username }, 'accessTokenPrivateKey', { expiresIn: '1h' });
      return newAccessToken;
    } catch (error: any) {
      return new Error(`Failed to refresh Access Token: ${error}`);
    }
  }
}


export default AuthService;
