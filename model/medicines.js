import { Sequelize } from 'sequelize';
import db from '../config/db.js';
import Stores from './storeusers.js'; // Adjust the path as needed

const { DataTypes } = Sequelize;

const Medicines = db.define('medicines', {
    namaObat: {
        type: DataTypes.STRING
    },
    deskripsi: {
        type: DataTypes.STRING
    },
    stok: {
        type: DataTypes.INTEGER
    },
    harga: {
        type: DataTypes.INTEGER
    },
    penyakit:{
        type: DataTypes.ENUM,
        values: ['Bercak Daun pada Cabai', 'Kutu Putih pada Cabai', 'Keriting Daun pada Cabai',
            'Virus Kuning pada Cabai', 'Virus Kuning pada Cabai', 'Bercak Daun pada Tomat', 
            'Hawar Daun pada Tomat', 'Busuk Daun pada Tomat', 'Jamur Daun pada Tomat', 
            'Virus Mosaik pada Tomat', 'Tungau Laba-Laba pada Tomat', 'Bercak Bakteri pada Tomat', 
            'Virus Kuning pada Tomat'],
        validate: {
            isIn: {
                args: [['Bercak Daun pada Cabai', 'Kutu Putih pada Cabai', 'Keriting Daun pada Cabai',
                    'Virus Kuning pada Cabai', 'Virus Kuning pada Cabai', 'Bercak Daun pada Tomat', 
                    'Hawar Daun pada Tomat', 'Busuk Daun pada Tomat', 'Jamur Daun pada Tomat', 
                    'Virus Mosaik pada Tomat', 'Tungau Laba-Laba pada Tomat', 'Bercak Bakteri pada Tomat', 
                    'Virus Kuning pada Tomat']]
                }
            }
    },
    gambar: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING
    },
    storeuserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Stores,
            key: 'id'
        }
    }
}, {
    freezeTableName: true
});

export default Medicines;

// (async () => {
//     await db.sync();
// })();
