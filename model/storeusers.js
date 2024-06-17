import {Sequelize} from "sequelize";
import db from "../config/db.js"

const { DataTypes } = Sequelize

const Stores = db.define('storeusers', {
    namaToko:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    alamat:{
        type:DataTypes.STRING
    },
    noHp:{
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



export default Stores
