"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const imageStorage = multer_1.default.diskStorage({
    destination: (req, res, cb) => cb(null, 'src/public/images/users'),
    filename: (req, file, cb) => cb(null, Date.now() + String(Math.floor(Math.random() * 10000)) + path_1.default.extname(file.originalname))
});
const uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("The file must contain the extension jpg or png!"));
        }
        return cb(null, true);
    }
});
exports.default = uploadImage;
