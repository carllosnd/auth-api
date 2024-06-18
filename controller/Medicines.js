import path from 'path';
import fs from 'fs';
import Medicines from "../model/medicines.js";
import storeusers from "../model/storeusers.js";
export const addMedicine = async (req, res) => {
    try {
        const user = await storeusers.findOne({
            where: {
                email: req.user.email
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User tidak ditemukan'
            });
        }

        const { namaObat, deskripsi, stok, harga, penyakit } = req.body;
        const file = req.file;

        // Validasi apakah nama obat sudah ada untuk user yang sedang login
        const existingMedicine = await Medicines.findOne({
            where: {
                namaObat,
                storeuserId: user.id
            }
        });

        if (existingMedicine) {
            return res.status(400).json({
                status: 'fail',
                message: 'Nama obat sudah ada, silakan gunakan nama obat lain'
            });
        }

        // Validate file upload
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
            // Pindahkan file ke folder uploads
            fs.renameSync(file.path, filePath);

            // Simpan data obat ke database
            const newMedicine = await Medicines.create({
                namaObat,
                deskripsi,
                stok,
                harga,
                penyakit,
                gambar: gambarName,
                url,
                storeuserId: user.id // Simpan storeuserId
            });

            res.status(201).json({
                status: 'success',
                message: 'Data obat berhasil ditambahkan',
                medicine: newMedicine // Kirim data obat yang baru ditambahkan sebagai respons
            });
        } catch (error) {
            console.log(error.message);
            // Hapus file yang gagal diunggah ke folder uploads
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            res.status(500).json({
                status: 'fail',
                message: 'Gagal menambahkan data obat. Silakan coba lagi nanti.'
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error'
        });
    }
};

export const getMedicines = async (req, res) => {
    try {
        const user = await storeusers.findOne({
            where: {
                email: req.user.email
            }
        });

        const medicines = await Medicines.findAll({
            where: {
                storeuserId: user.id
            }
        });

        res.status(200).json({
            status: 'success',
            message: "Berhasil memuat data obat",
            medicines
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error'
        });
    }
};

export const deleteMedicine = async (req, res) => {
    try {
        const user = await storeusers.findOne({
            where: {
                email: req.user.email
            }
        });

        const { id } = req.params;

        const medicine = await Medicines.findOne({
            where: {
                id,
                storeuserId: user.id
            }
        });

        if (!medicine) {
            return res.status(404).json({
                status: 'fail',
                message: 'Data obat tidak ditemukan atau Anda tidak memiliki izin'
            });
        }

        // Path lengkap menuju file gambar yang akan dihapus
        const filePath = `./uploads/${medicine.gambar}`;

        // Hapus file gambar jika ada
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err.message);
                    return res.status(500).json({
                        status: 'fail',
                        message: 'Gagal menghapus gambar'
                    });
                }
            });
        }

        await Medicines.destroy({
            where: {
                id
            }
        });

        res.status(200).json({
            status: 'success',
            message: 'Data obat berhasil dihapus'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error'
        });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        const user = await storeusers.findOne({
            where: {
                email: req.user.email
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User tidak ditemukan'
            });
        }

        const { id } = req.params;
        const { namaObat, deskripsi, stok, harga, penyakit } = req.body;

        const medicine = await Medicines.findOne({
            where: {
                id: id,
                storeuserId: user.id
            }
        });

        if (!medicine) {
            return res.status(404).json({
                status: 'fail',
                message: 'Obat tidak ditemukan'
            });
        }

        if (req.file) {
            const file = req.file;
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

            // Hapus gambar lama jika ada
            if (medicine.gambar) {
                fs.unlink(`./uploads/${medicine.gambar}`, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                });
            }

            fs.rename(file.path, `./uploads/${gambarName}`, async (err) => {
                if (err) {
                    return res.status(500).json({
                        status: 'fail',
                        message: err.message
                    });
                }

                try {
                    await Medicines.update({
                        namaObat,
                        deskripsi,
                        stok,
                        harga,
                        penyakit,
                        gambar: gambarName,
                        url
                    }, {
                        where: {
                            id: id,
                            storeuserId: user.id
                        }
                    });

                    res.status(200).json({
                        status: 'success',
                        message: 'Data obat berhasil diperbarui',
                        data:{
                            namaObat, deskripsi, penyakit, harga, stok, gambar, url
                        }
                    });
                } catch (error) {
                    console.log(error.message);
                    res.status(500).json({
                        status: 'fail',
                        message: 'Internal Server Error'
                    });
                }
            });
        } else {
            try {
                await Medicines.update({
                    namaObat,
                    deskripsi,
                    stok,
                    harga,
                    penyakit
                }, {
                    where: {
                        id: id,
                        storeuserId: user.id
                    }
                });

                res.status(200).json({
                    status: 'success',
                    message: 'Data obat berhasil diperbarui',
                    data:{
                        namaObat, deskripsi, penyakit, harga, stok
                    }
                });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({
                    status: 'fail',
                    message: 'Internal Server Error'
                });
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error'
        });
    }
};
