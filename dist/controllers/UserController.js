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
const db_1 = __importDefault(require("../db"));
const firestore_1 = require("firebase/firestore");
const fs_1 = __importDefault(require("fs"));
const User_1 = __importDefault(require("../models/User"));
const CreateUserToken_1 = __importDefault(require("../helpers/CreateUserToken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const GetToken_1 = __importDefault(require("../helpers/GetToken"));
const GetUserByToken_1 = __importDefault(require("../helpers/GetUserByToken"));
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Get informations
            const { name, email, password, confirmpassword, phone } = req.body;
            let image = '';
            if (req.file) {
                image = req.file.filename;
            }
            const pathImage = `src/public/images/users/${image}`;
            if (!req.file) {
                image = 'nullimage.jpg';
            }
            //Validations
            if (!name) {
                fs_1.default.unlink(pathImage, (err) => { });
                return res.status(422).json({ message: 'Digite um nome válido' });
            }
            if (!email) {
                fs_1.default.unlink(pathImage, (err) => { });
                return res.status(422).json({ message: 'Digite um email válido' });
            }
            let userAlreadyExists = [];
            const q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.default, "users"), (0, firestore_1.where)("email", "==", email));
            const querySnapshot = yield (0, firestore_1.getDocs)(q);
            querySnapshot.forEach((doc) => {
                userAlreadyExists.push(doc.data());
            });
            if (userAlreadyExists.length > 0) {
                fs_1.default.unlink(pathImage, (err) => { });
                return res.status(422).json({ message: 'Este email já está cadastrado' });
            }
            if (!password || password !== confirmpassword) {
                fs_1.default.unlink(pathImage, (err) => { });
                return res.status(422).json({ message: 'Senha está incorreta' });
            }
            const salt = yield bcrypt_1.default.genSalt(12);
            const passwordHash = yield bcrypt_1.default.hash(password, salt);
            if (!phone) {
                fs_1.default.unlink(pathImage, (err) => { });
                return res.status(422).json({ message: 'Digite um telefone válido' });
            }
            //New user
            const user = new User_1.default(name, email, passwordHash, image, phone);
            try {
                yield (0, firestore_1.setDoc)((0, firestore_1.doc)(db_1.default, "users", String(user.id)), {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    image: user.image,
                    phone: user.phone
                });
                yield (0, CreateUserToken_1.default)(user, req, res);
            }
            catch (err) {
                fs_1.default.unlink(pathImage, (err) => { });
                res.status(500).json({ message: err });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            //Validations
            if (!email) {
                return res.status(422).json({ message: 'Digite um email válido' });
            }
            if (!password) {
                return res.status(422).json({ message: 'Digite uma senha válida' });
            }
            let userAlreadyExists = [];
            const q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.default, "users"), (0, firestore_1.where)("email", "==", email));
            const querySnapshot = yield (0, firestore_1.getDocs)(q);
            querySnapshot.forEach((doc) => {
                userAlreadyExists.push(doc.data());
            });
            if (userAlreadyExists.length < 1) {
                return res.status(422).json({ message: "Usuário não existe" });
            }
            const user = userAlreadyExists[0];
            //check if password match with db
            const checkPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!checkPassword) {
                return res.status(422).json({ message: 'invalid password' });
            }
            yield (0, CreateUserToken_1.default)(user, req, res);
        });
    }
    static getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, GetToken_1.default)(req);
            const user = yield (0, GetUserByToken_1.default)(token, res);
            try {
                delete user.password;
                delete user.id;
            }
            catch (err) {
                return res.status(422).json({ message: 'Usuário inválido' });
            }
            return res.json({ message: user });
        });
    }
    static editUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, phone, noImage } = req.body;
            let image;
            if (req.file) {
                image = req.file.filename;
            }
            let updatedData = {};
            if (name) {
                updatedData = Object.assign(Object.assign({}, updatedData), { name: name });
            }
            if (email) {
                updatedData = Object.assign(Object.assign({}, updatedData), { email: email });
            }
            if (password) {
                updatedData = Object.assign(Object.assign({}, updatedData), { password: password });
            }
            if (phone) {
                updatedData = Object.assign(Object.assign({}, updatedData), { phone: phone });
            }
            if (image) {
                updatedData = Object.assign(Object.assign({}, updatedData), { image: image });
            }
            const token = (0, GetToken_1.default)(req);
            const user = yield (0, GetUserByToken_1.default)(token, res);
            const pathImage = `src/public/images/users/${user.image}`;
            if (noImage) {
                updatedData = Object.assign(Object.assign({}, updatedData), { image: 'nullimage.jpg' });
                fs_1.default.unlink(pathImage, (err) => console.log(err));
            }
            if (Object.keys(updatedData).length < 1) {
                return res.status(422).json({ message: 'Nenhum dado recebido' });
            }
            try {
                const userRef = (0, firestore_1.doc)(db_1.default, 'users', String(user.id));
                yield (0, firestore_1.updateDoc)(userRef, updatedData);
                return res.json({ message: 'Usuário atualizado com sucesso' });
            }
            catch (error) {
                return res.status(422).json({ message: 'Usuário inválido' });
            }
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, GetToken_1.default)(req);
            const user = yield (0, GetUserByToken_1.default)(token, res);
            if (!user) {
                return res.json({ message: 'Token está inválido!' });
            }
            const image = user.image === 'nullimage.jpg' ? null : user.image;
            const pathImage = `src/public/images/users/${image}`;
            try {
                const userRef = (0, firestore_1.doc)(db_1.default, 'users', String(user.id));
                yield (0, firestore_1.deleteDoc)(userRef);
                if (image !== null) {
                    fs_1.default.unlink(pathImage, (err) => console.log(err));
                }
                return res.json({ message: "Usuário deletado com sucesso" });
            }
            catch (err) {
                return res.status(422).json({ message: 'Não foi possivel deletar o usuário' });
            }
        });
    }
}
exports.default = UserController;
