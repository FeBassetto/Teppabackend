"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const UploadImage_1 = __importDefault(require("../helpers/UploadImage"));
const VerifyToken_1 = __importDefault(require("../helpers/VerifyToken"));
const userRouter = (0, express_1.Router)();
userRouter.get('/', VerifyToken_1.default, UserController_1.default.getUserData);
userRouter.post('/login', UserController_1.default.login);
userRouter.post('/register', UploadImage_1.default.single('image'), UserController_1.default.register);
userRouter.patch('/edit', UploadImage_1.default.single('image'), VerifyToken_1.default, UserController_1.default.editUserData);
userRouter.delete('/delete', VerifyToken_1.default, UserController_1.default.deleteUser);
exports.default = userRouter;
