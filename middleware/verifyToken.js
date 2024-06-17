import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null)
        return res.status(401).json({
            status: "fail",
            message: "Token belum disertakan"
        });
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if(err)
            return res.status(403).json({
                status: "fail",
                message: "Gagal mengautentikasi token"
            })
        req.user = decoded
        next()
    })
}