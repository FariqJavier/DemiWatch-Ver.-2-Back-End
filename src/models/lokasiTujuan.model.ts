import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import RiwayatPerjalanan from './riwayatPerjalanan.model';

class LokasiTujuan extends Model {
  public lokasi_tujuan_id!: string;
  public riwayat_perjalanan_id!: string;
  public alamat_tujuan!: string;
  public longitude_tujuan!: Float32Array;
  public latitude_tujuan!: Float32Array;
  public readonly timestamp!: Date;
}

LokasiTujuan.init({
  lokasi_tujuan_id: {
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
  alamat_tujuan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude_tujuan: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  latitude_tujuan: {
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
  tableName: 'lokasi_tujuan',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default LokasiTujuan;