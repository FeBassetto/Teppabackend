"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = __importDefault(require("../controllers/TaskController"));
const VerifyToken_1 = __importDefault(require("../helpers/VerifyToken"));
const tasksRouter = (0, express_1.Router)();
tasksRouter.get('/', VerifyToken_1.default, TaskController_1.default.getAllTasks);
tasksRouter.get('/:id', VerifyToken_1.default, TaskController_1.default.getTask);
tasksRouter.post('/create', VerifyToken_1.default, TaskController_1.default.createTask);
tasksRouter.patch('/edit/:id', VerifyToken_1.default, TaskController_1.default.updateTask);
tasksRouter.delete('/delete/:id', VerifyToken_1.default, TaskController_1.default.deleteTask);
exports.default = tasksRouter;
