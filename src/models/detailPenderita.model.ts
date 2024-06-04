import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/config';
import Penderita from './penderita.model';

class DetailPenderita extends Model {
  public detail_penderita_id!: string;
  public penderita_id!: string;
  public nama!: string;
  public alamat_rumah!: string;
  public tanggal_lahir!: Date;
  public gender!: string;
}

DetailPenderita.init({
  detail_penderita_id: {
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
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat_rumah: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggal_lahir: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'detail_penderita',
  timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
});

export default DetailPenderita;