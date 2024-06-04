import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import RiwayatPerjalanan from './riwayatPerjalanan.model';

class LokasiAwal extends Model {
  public lokasi_awal_id!: string;
  public riwayat_perjalanan_id!: string;
  public alamat_awal!: string;
  public longitude_awal!: Float32Array;
  public latitude_awal!: Float32Array;
  public readonly timestamp!: Date;
}

LokasiAwal.init({
  lokasi_awal_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  riwayat_perjalanan_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    references: {
      model: RiwayatPerjalanan,
      key: 'riwayat_perjalanan_id'
    }
  },
  alamat_awal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude_awal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  latitude_awal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'lokasi_awal',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default LokasiAwal;