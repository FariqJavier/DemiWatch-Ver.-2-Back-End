import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Penderita from './penderita.model';

class Emergensi extends Model {
  public emergensi_id!: string;
  public penderita_id!: string;
  public bpm_sepuluh_menit_terakhir!: Int16Array;
  public jarak_tersesat!: Float32Array;
  public emergensi_button!: boolean;
  public nilai_accelerometer!: Float32Array;
}

Emergensi.init({
  emergensi_id: {
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
  bpm_sepuluh_menit_terakhir: {
    type: DataTypes.INTEGER,
  },
  jarak_tersesat: {
    type: DataTypes.FLOAT,
  },
  emergensi_button: {
    type: DataTypes.BOOLEAN,
  },
  nilai_accelerometer: {
    type: DataTypes.FLOAT,
  },
}, {
  sequelize,
  tableName: 'emergensi',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default Emergensi;