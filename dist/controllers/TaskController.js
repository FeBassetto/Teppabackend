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
const firestore_2 = require("firebase/firestore");
const firestore_3 = require("firebase/firestore");
const firestore_4 = require("firebase/firestore");
const firestore_5 = require("firebase/firestore");
const firestore_6 = require("firebase/firestore");
const firestore_7 = require("firebase/firestore");
const firestore_8 = require("firebase/firestore");
const db_1 = __importDefault(require("../db"));
const GetToken_1 = __importDefault(require("../helpers/GetToken"));
const GetUserByToken_1 = __importDefault(require("../helpers/GetUserByToken"));
const Task_1 = __importDefault(require("../models/Task"));
class TaskController {
    static createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, limitDate } = req.body;
            const token = (0, GetToken_1.default)(req);
            const user = yield (0, GetUserByToken_1.default)(token, res);
            delete user.password;
            if (!title) {
                return res.status(422).json({ message: 'Título inválido!' });
            }
            if (!description) {
                return res.status(422).json({ message: 'Descrição inválido!' });
            }
            if (!limitDate) {
                return res.status(422).json({ message: 'Data limite inválida!' });
            }
            if (!user) {
                return res.status(422).json({ message: 'Token inválido!' });
            }
            const task = new Task_1.default(title, description, limitDate, user);
            try {
                yield (0, firestore_8.setDoc)((0, firestore_7.doc)(db_1.default, "tasks", String(task.id)), {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    createdAt: task.createdAt,
                    limitDate: task.limitDate,
                    concluded: task.concluded,
                    user: task.user
                });
                return res.json({ message: 'Task criada com sucesso!' });
            }
            catch (err) {
                return res.status(422).json({ message: 'Não foi possível cadastrar a Task, tente novamente.' });
            }
        });
    }
    static getTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let taskAlreadyExists = [];
            const q = (0, firestore_6.query)((0, firestore_5.collection)(db_1.default, "tasks"), (0, firestore_4.where)("id", "==", id));
            const querySnapshot = yield (0, firestore_3.getDocs)(q);
            querySnapshot.forEach((doc) => {
                taskAlreadyExists.push(doc.data());
            });
            if (taskAlreadyExists.length < 1) {
                return res.status(422).json({ message: 'Task com id pesquisado não existe!' });
            }
            const task = taskAlreadyExists[0];
            const token = (0, GetToken_1.default)(req);
            const user = yield (0, GetUserByToken_1.default)(token, res);
            if (task.user.id !== user.id) {
                return res.status(422).json({ message: 'Token inválido!' });
            }
            delete task.user;
            res.json({ task });
        });
    }
    static getAllTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, concluded } = req.query;
            const token = (0, GetToken_1.default)(req);
            const user = yield (0, GetUserByToken_1.default)(token, res);
            const concludedFilter = concluded ? concluded === "false" ? false : true : false;
            try {
                let tasks = [];
                const q = (0, firestore_6.query)((0, firestore_5.collection)(db_1.default, "tasks"), (0, firestore_4.where)("user.id", "==", user.id), (0, firestore_4.where)("concluded", "==", concludedFilter));
                const querySnapshot = yield (0, firestore_3.getDocs)(q);
                querySnapshot.forEach((doc) => {
                    tasks.push(doc.data());
                });
                if (title) {
                    const filterTasks = tasks.filter(task => {
                        if (task.title.includes(String(title).toUpperCase())) {
                            return task;
                        }
                    });
                    return res.json({ filterTasks });
                }
                return res.json({ tasks });
            }
            catch (err) {
                return res.status(422).json({ message: 'Não foi possível resgatar suas Tasks!', err });
            }
        });
    }
    static updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { title, description, limitDate, concluded } = req.body;
            let taskAlreadyExists = [];
            const q = (0, firestore_6.query)((0, firestore_5.collection)(db_1.default, "tasks"), (0, firestore_4.where)("id", "==", id));
            const querySnapshot = yield (0, firestore_3.getDocs)(q);
            querySnapshot.forEach((doc) => {
                taskAlreadyExists.push(doc.data());
            });
            if (taskAlreadyExists.length < 1) {
                return res.status(422).json({ message: 'Task com id pesquisado não existe!' });
            }
            const task = taskAlreadyExists[0];
            const token = (0, GetToken_1.default)(req);
            const user = yield (0, GetUserByToken_1.default)(token, res);
            if (task.user.id !== user.id) {
                return res.status(422).json({ message: 'Token Inválido!' });
            }
            if (!title && !description && !limitDate && !concluded) {
                return res.status(422).json({ message: "Nenhum dado recebido!" });
            }
            let updatedTaks = {};
            if (title) {
                updatedTaks = Object.assign(Object.assign({}, updatedTaks), { title: String(title).toUpperCase() });
            }
            if (description) {
                updatedTaks = Object.assign(Object.assign({}, updatedTaks), { description: description });
            }
            if (limitDate) {
                updatedTaks = Object.assign(Object.assign({}, updatedTaks), { limitDate: limitDate });
            }
            if (concluded === true || concluded === false) {
                updatedTaks = Object.assign(Object.assign({}, updatedTaks), { concluded: concluded });
            }
            if (Object.keys(updatedTaks).length < 1) {
                return res.status(422).json({ message: 'Nenhum dado recebido!' });
            }
            try {
                const taskRef = (0, firestore_7.doc)(db_1.default, 'tasks', String(id));
                yield (0, firestore_2.updateDoc)(taskRef, updatedTaks);
                return res.json({ message: 'Task atualizada com sucesso!' });
            }
            catch (err) {
                return res.status(422).json({ message: 'Não foi possível atualizar os dados!' });
            }
        });
    }
    static deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let taskAlreadyExists = [];
            const q = (0, firestore_6.query)((0, firestore_5.collection)(db_1.default, "tasks"), (0, firestore_4.where)("id", "==", id));
            const querySnapshot = yield (0, firestore_3.getDocs)(q);
            querySnapshot.forEach((doc) => {
                taskAlreadyExists.push(doc.data());
            });
            if (taskAlreadyExists.length < 1) {
                return res.status(422).json({ message: 'Task com id pesquisado não existe!' });
            }
            const task = taskAlreadyExists[0];
            const token = (0, GetToken_1.default)(req);
            const user = yield (0, GetUserByToken_1.default)(token, res);
            if (task.user.id !== user.id) {
                return res.status(422).json({ message: 'Token inválido!' });
            }
            try {
                const taskref = (0, firestore_7.doc)(db_1.default, 'tasks', String(id));
                yield (0, firestore_1.deleteDoc)(taskref);
                return res.json({ message: 'Task deletada com sucesso!' });
            }
            catch (err) {
                return res.status(422).json({ message: "Não foi possível deletar task!" });
            }
        });
    }
}
exports.default = TaskController;
