import { Request } from "express";
import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
    destination: (req, res, cb) => cb(null, 'src/public/images/users'),
    filename: (req, file, cb) => cb(null, Date.now() + String(Math.floor(Math.random() * 10000)) + path.extname(file.originalname))
})

const uploadImage = multer({
    storage: imageStorage,
    fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("The file must contain the extension jpg or png!"))
        }
        return cb(null, true)
    }
})

export default uploadImage