import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Penderita from './penderita.model';

class Alamat extends Model {
  public alamat_id!: string;
  public penderita_id!: string;
  public alamat!: string;
  public longitude!: Float32Array;
  public latitude!: Float32Array;
}

Alamat.init({
  alamat_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  penderita_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    references: {
      model: Penderita,
      key: 'penderita_id'
    }
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'alamat',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default Alamat;