import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';

class Keluarga extends Model {
  public keluarga_id!: string;
  public username!: string;
  public password!: string;
}

Keluarga.init({
  keluarga_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'keluarga',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default Keluarga;
