import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Penderita from './penderita.model';

class RiwayatPerjalanan extends Model {
  public riwayat_perjalanan_id!: string;
  public penderita_id!: string;
  public status!: string;
  public readonly created_at!: Date;
}

RiwayatPerjalanan.init({
  riwayat_perjalanan_id: {
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
  status: {
    type: DataTypes.STRING,
    defaultValue: 'BERLANGSUNG',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'riwayat_perjalanan',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default RiwayatPerjalanan;
