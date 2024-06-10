import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import RiwayatDetakJantung from './riwayatDetakJantung.model';

class DetakJantung extends Model {
  public detak_jantung_id!: string;
  public riwayat_detak_jantung_id!: string;
  public bpm_terakhir!: Int16Array;
  public readonly timestamp!: Date;
}

DetakJantung.init({
  detak_jantung_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  riwayat_detak_jantung_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
        model: RiwayatDetakJantung,
        key: 'riwayat_detak_jantung_id'
      }
  },
  bpm_terakhir: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'detak_jantung',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default DetakJantung;