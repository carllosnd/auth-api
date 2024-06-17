import express from "express"
import db from "./config/db.js"
import dotenv from "dotenv"
import router from "./routes/routes.js";
import cookieParser from "cookie-parser"
import FileUpload from "express-fileupload"
import cors from "cors"
const app = express()
const port = process.env.PORT || 8080;
dotenv.config();


try {
    await db.authenticate()
    console.log('Database connected')
    // await db.sync({ alter: true })
} catch (error) {
    console.error(error)
}


app.use(express.json())
app.use(cookieParser())
app.use(router)
app.use(cors())
app.use(FileUpload())
app.use('/uploads', express.static('uploads'));
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});