import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';

class Penderita extends Model {
  public penderita_id!: string;
  public username!: string;
  public password!: string;
}

Penderita.init({
  penderita_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false
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
  tableName: 'penderita',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default Penderita;