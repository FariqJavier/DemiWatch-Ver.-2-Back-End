import { Model, DataTypes } from 'sequelize';
import Patient from './patient.model';
import sequelize from '../utils/config';

class HeartRateHistory extends Model {
  public heart_rate_id!: string;
  public patient_id!: string;
  public heart_rate_value!: Int16Array;
  public heart_rate_status!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

HeartRateHistory.init({
  heart_rate_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  patient_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
        model: Patient,
        key: 'patient_id'
      }
  },
  heart_rate_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  heart_rate_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'heartratehistory',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default HeartRateHistory;