"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const db_1 = __importDefault(require("../db"));
const getUserByToken = (token, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado!' });
    }
    const decoded = jsonwebtoken_1.default.verify(token, String(config_1.default.SECRET_ID));
    const userId = decoded.id;
    let userAlreadyExists = [];
    const q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.default, "users"), (0, firestore_1.where)("id", "==", userId));
    const querySnapshot = yield (0, firestore_1.getDocs)(q);
    querySnapshot.forEach((doc) => {
        userAlreadyExists.push(doc.data());
    });
    const user = userAlreadyExists[0];
    return user;
});
exports.default = getUserByToken;
