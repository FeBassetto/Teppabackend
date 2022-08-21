"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const GetToken_1 = __importDefault(require("./GetToken"));
const VerifyToken = (req, res, next) => {
    try {
        const token = (0, GetToken_1.default)(req);
        try {
            jsonwebtoken_1.default.verify(token, String(config_1.default.SECRET_ID));
            next();
        }
        catch (err) {
            return res.status(401).json({ message: "Token inválido!" });
        }
    }
    catch (err) {
        return res.status(401).json({ message: "Access denied!" });
    }
};
exports.default = VerifyToken;
