import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import RiwayatPerjalanan from './riwayatPerjalanan.model';

class LokasiTerakhir extends Model {
  public lokasi_terakhir_id!: string;
  public riwayat_perjalanan_id!: string;
  public longitude_terakhir!: Float32Array;
  public latitude_terakhir!: Float32Array
  public readonly timestamp!: Date;
}

LokasiTerakhir.init({
  lokasi_terakhir_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  riwayat_perjalanan_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: RiwayatPerjalanan,
      key: 'riwayat_perjalanan_id'
    }
  },
  longitude_terakhir: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  latitude_terakhir: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'lokasi_terakhir',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default LokasiTerakhir;