import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Keluarga from './keluarga.model';

class DetailKeluarga extends Model {
  public detail_keluarga_id!: string;
  public keluarga_id!: string;
  public nama!: string;
  public nomor_hp!: string;
}

DetailKeluarga.init({
  detail_keluarga_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  keluarga_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Keluarga,
      key: 'keluarga_id'
    }
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomor_hp: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'detail_keluarga',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default DetailKeluarga;