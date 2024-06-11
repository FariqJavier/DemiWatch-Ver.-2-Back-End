import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Penderita from './penderita.model';
import Keluarga from './keluarga.model';
import Emergensi from './emergensi.model';

class Notifikasi extends Model {
  public notifikasi_id!: string;
  public penderita_id!: string;
  public keluarga_id!: string;
  public emergensi_id!: string;
  public tipe!: string;
  public pesan!: string;
  public timestamp!: Date;
  public readonly created_at!: Date;
}

Notifikasi.init({
  notifikasi_id: {
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
  keluarga_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Keluarga,
      key: 'keluarga_id'
    }
  },
  emergensi_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Emergensi,
      key: 'emergensi_id'
    }
  },
  tipe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pesan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
}, {
  sequelize,
  tableName: 'notifikasi',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default Notifikasi;