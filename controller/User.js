import farmeruser from "../model/farmeruser.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Farmers from "../model/farmeruser.js";
import Stores from "../model/storeusers.js";
import storeusers from "../model/storeusers.js";
import path from "path";
import fs from "fs";
export const getStoreUsers = async (req, res) => {
    try {
        const user = await storeusers.findOne({
            where: {
                email : req.user.email
            }
        });
        if (!user)
            return res.status(404).json({
                status: "fail",
                message: "User tidak ditemukan"
            })
        res.json(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

export const getFarmerUsers = async (req, res) => {
    try {
        const user = await farmeruser.findOne({
            where: {
                email : req.user.email
            }
        });
        if (!user)
            return res.status(404).json({
                status: "fail",
                message: "User tidak ditemukan"
            })
        res.json(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};
export const registerFarmer = async (req, res) => {
    const { namaLengkap, email, password, confPassword } = req.body;
    const file = req.file;

    // Validasi email harus mengandung karakter '@'
    if (!email || !email.includes('@')) {
        return res.status(400).json({
            status: 'fail',
            message: 'Email tidak valid'
        });
    }

    if (password !== confPassword) {
        return res.status(400).json({
            status: 'fail',
            message: 'Password dan Confirm Password tidak sama'
        });
    }

    if (!file) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gambar belum disertakan'
        });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext)) {
        return res.status(422).json({
            status: 'fail',
            message: 'Gambar yang diupload harus dalam tipe .png, .jpg, atau .jpeg'
        });
    }

    if (file.size > 5000000) { // 5MB size limit
        return res.status(422).json({
            status: 'fail',
            message: 'Ukuran gambar tidak boleh lebih dari 5MB'
        });
    }

    const gambarName = `${file.filename}${ext}`;
    const url = `${req.protocol}://${req.get("host")}/uploads/${gambarName}`;
    const filePath = `./uploads/${gambarName}`;

    try {
        const existingUser = await Farmers.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email sudah terdaftar'
            });
        }

        // Move file to uploads folder
        fs.renameSync(file.path, filePath);

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new Farmer record
        const newFarmer = await Farmers.create({
            namaLengkap: namaLengkap,
            email: email,
            password: hashPassword,
            gambar: gambarName,
            url: url
        });

        res.json({
            status: 'success',
            message: 'Registrasi berhasil',
            data: newFarmer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error'
        });
    }
};

export const registerStore = async (req, res) => {
    const { namaToko, email, alamat, noHp, password, confPassword } = req.body
    const file = req.file;

    if (!email || !email.includes('@'))
        return res.status(400).json({
            status: 'fail',
            message: 'Email tidak valid'
        });

    if (password !== confPassword)
        return res.status(400).json({
            status: "fail",
            message: "Password dan Confirm Password tidak sama"
        })

    if (!file) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gambar belum disertakan'
        });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext)) {
        return res.status(422).json({
            status: 'fail',
            message: 'Gambar yang diupload harus dalam tipe .png, .jpg, atau .jpeg'
        });
    }

    if (file.size > 5000000) { // 5MB size limit
        return res.status(422).json({
            status: 'fail',
            message: 'Ukuran gambar tidak boleh lebih dari 5MB'
        });
    }

    const gambarName = `${file.filename}${ext}`;
    const url = `${req.protocol}://${req.get("host")}/uploads/${gambarName}`;
    const filePath = `./uploads/${gambarName}`;

    try {
        const existingUser = await Stores.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "Email sudah terdaftar"
            });
        }

        fs.renameSync(file.path, filePath);

        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)

        const newStore = await Stores.create({
            namaToko: namaToko,
            email: email,
            alamat: alamat,
            noHp: noHp,
            password: hashPassword,
            gambar : gambarName,
            url : url
        })
        res.json({
            status: "success",
            message: "Registrasi berhasil",
            data: newStore
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error'
        });
    }
}

export const loginFarmer = async (req, res) => {
    try {
        const user = await Farmers.findAll({
            where:{
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match)
            return res.status(400).json({
                status: "fail",
                message: "Password salah"
            })
        const userId = user[0].id
        const namaLengkap = user[0].namaLengkap
        const email = user[0].email
        const accessToken = jwt.sign({userId, namaLengkap, email}, process.env.ACCESS_TOKEN, {
            expiresIn: '1h'
        })
        const refreshToken = jwt.sign({userId, namaLengkap, email}, process.env.REFRESH_TOKEN, {
            expiresIn: '1d'
        })
        await Farmers.update({refresh_token: refreshToken}, {
            where:{
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.json({
            status: "success",
            message: "Berhasil login",
            data:{
                namaLengkap, email, accessToken
            }})
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "Email tidak ditemukan"
        })
    }
}

export const loginStore = async (req, res) => {
    try {
        const user = await Stores.findAll({
            where:{
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match)
            return res.status(400).json({
                status: "fail",
                message: "Password salah"
            })
        const userId = user[0].id
        const namaToko = user[0].namaToko
        const email = user[0].email
        const alamat = user[0].alamat
        const noHp = user[0].noHp
        const accessToken = jwt.sign({userId, namaToko, email}, process.env.ACCESS_TOKEN, {
            expiresIn: '1h'
        })
        const refreshToken = jwt.sign({userId, namaToko, email}, process.env.REFRESH_TOKEN, {
            expiresIn: '1d'
        })
        await Stores.update({refresh_token: refreshToken}, {
            where:{
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.json(
            {
                status: "success",
                message: "Berhasil login",
                data:{
                    namaToko, email, alamat, noHp, accessToken
                }})
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "Email tidak ditemukan"
        })
    }
}

export const logoutFarmer = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken)
        return res.sendStatus(204)
    const user = await Farmers.findAll({
        where:{
            refresh_token: refreshToken
        }
    })
    if(!user[0])
        return res.sendStatus(204)
    const userId = user[0].id
    await Farmers.update({ refresh_token : null}, {
        where:{
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.status(200).json({
        status: "success",
        message: "Berhasil logout"
    })
}

export const logoutStore = async (req, res) => {
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
    const userId = user[0].id
    await Farmers.update({ refresh_token : null}, {
        where:{
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.status(200).json({
        status: "success",
        message: "Berhasil logout"
    })
}