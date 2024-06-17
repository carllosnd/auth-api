import {Sequelize} from "sequelize";
import db from "../config/db.js"

const { DataTypes } = Sequelize

const Farmers = db.define('farmerusers', {
    namaLengkap:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    gambar:{
        type:DataTypes.STRING
    },
    url:{
        type:DataTypes.STRING
    },
    refresh_token:{
        type:DataTypes.TEXT
    }
},{
    freezeTableName:true
})

export default Farmers;

// (async () => {
//     await db.sync();
// })();