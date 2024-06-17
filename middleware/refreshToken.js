import Farmers from "../model/farmeruser.js";
import jwt from "jsonwebtoken"
import Stores from "../model/storeusers.js";

export const refreshTokenFarmer = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken)
            return res.sendStatus(401)
        const user = await Farmers.findAll({
            where:{
                refresh_token: refreshToken
            }
        })
        if(!user[0])
            return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if(err) return res.sendStatus(403)
            const userId = user[0].id
            const namaLengkap = user[0].namaLengkap
            const email = user[0].email
            const accessToken = jwt.sign({ userId, namaLengkap, email}, process.env.ACCESS_TOKEN, {
                expiresIn : '15s'
            })
            res.json({
                status: "success",
                message: "Berhasil memuat token",
                data: {
                    namaLengkap,
                    accessToken
                }})
        })
    } catch (error) {
        console.log(error)
    }
}

export const refreshTokenStore = async (req, res) => {
    try {
        const refreshTokenStore = req.cookies.refreshToken
        if(!refreshTokenStore)
            return res.sendStatus(401)
        const user = await Stores.findAll({
            where:{
                refresh_token: refreshTokenStore
            }
        })
        if(!user[0])
            return res.sendStatus(403)
        jwt.verify(refreshTokenStore, process.env.REFRESH_TOKEN, (err, decoded) => {
            if(err) return res.sendStatus(403)
            const userId = user[0].id
            const namaToko = user[0].namaToko
            const email = user[0].email
            const accessToken = jwt.sign({ userId, namaToko, email}, process.env.ACCESS_TOKEN, {
                expiresIn : '15s'
            })
            res.json({
                status: "success",
                message: "Berhasil memuat token",
                data: {
                    namaToko,
                    accessToken
                }})
        })
    } catch (error) {
        console.log(error)
    }
}