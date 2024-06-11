import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Penderita from './penderita.model';

class Emergensi extends Model {
  public emergensi_id!: string;
  public penderita_id!: string;
  public bpm_sepuluh_menit_terakhir!: number;
  public jarak_tersesat!: number;
  public emergensi_button!: boolean;
  public nilai_accelerometer!: number;
  public readonly timestamp!: Date;
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
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  jarak_tersesat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  emergensi_button: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  nilai_accelerometer: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
}, {
  sequelize,
  tableName: 'emergensi',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default Emergensi;