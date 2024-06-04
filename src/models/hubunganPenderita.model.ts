import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Penderita from './penderita.model';
import Keluarga from './keluarga.model';

class HubungaPenderita extends Model {
  public penderita_id!: string;
  public keluarga_id!: string;
}

HubungaPenderita.init({
  penderita_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Penderita,
      key: 'penderita_id'
    }
  },
  keluarga_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Keluarga,
      key: 'keluarga_id'
    }
  },
}, {
  sequelize,
  tableName: 'hubungan_penderita',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default HubungaPenderita;