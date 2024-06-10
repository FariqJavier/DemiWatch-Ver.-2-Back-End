import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Penderita from './penderita.model';

class RiwayatDetakJantung extends Model {
  public riwayat_detak_jantung_id!: string;
  public penderita_id!: string;
  public bpm_terakhir!: Int16Array;
  public status!: string;
  public readonly timestamp!: Date;
}

RiwayatDetakJantung.init({
  riwayat_detak_jantung_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  penderita_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
        model: Penderita,
        key: 'penderita_id'
      }
  },
  bpm_terakhir: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'STABIL',
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'riwayat_detak_jantung',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default RiwayatDetakJantung;
