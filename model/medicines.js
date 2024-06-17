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
