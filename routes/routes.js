import express from "express";
import multer from "multer"
import { getStoreUsers, getFarmerUsers, registerFarmer, loginFarmer, logoutFarmer, logoutStore, registerStore, loginStore} from "../controller/User.js"
import { addMedicine, getMedicines, updateMedicine, deleteMedicine } from "../controller/Medicines.js";
const router = express.Router()
import { verifyToken} from "../middleware/verifyToken.js";
import { refreshTokenFarmer, refreshTokenStore } from "../middleware/refreshToken.js";

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5000000 }, // 5MB file size limit
});

router.get ('/users/farmer', verifyToken, getFarmerUsers)
router.get ('/users/store', verifyToken, getStoreUsers)
router.post('/register/farmer', upload.single('file'), registerFarmer)
router.post('/register/store', upload.single('file'), registerStore)
router.post('/login/farmer', loginFarmer)
router.post('/login/store', loginStore)
router.get('/token/farmer', refreshTokenFarmer)
router.get('/token/store', refreshTokenStore)
router.delete('/logout/farmer', logoutFarmer)
router.delete('/logout/store', logoutStore)

router.post('/addMedicine', upload.single('file'), verifyToken, addMedicine)
router.get('/getMedicines', verifyToken, getMedicines)
router.put('/updateMedicines/:id', upload.single('file'), verifyToken, updateMedicine)
router.delete('/delMedicines/:id', verifyToken, deleteMedicine)


export default router