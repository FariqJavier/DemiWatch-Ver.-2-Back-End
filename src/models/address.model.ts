import { Model, DataTypes } from 'sequelize';
import Patient from './patient.model';
import sequelize from '../utils/config';

class Address extends Model {
  public address_id!: string;
  public patient_id!: string;
  public address_type!: 'HOME' | 'DESTINATION';
  public address_name!: string;
  public latitude!: Int16Array;
  public longitude!: Int16Array;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Address.init({
  address_id: {
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
  address_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.INTEGER,
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
  tableName: 'address',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default Address;
