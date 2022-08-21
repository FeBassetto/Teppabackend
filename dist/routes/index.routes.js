"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskRoutes_routes_1 = __importDefault(require("./taskRoutes.routes"));
const userRoutes_routes_1 = __importDefault(require("./userRoutes.routes"));
const router = (0, express_1.Router)();
router.use('/user', userRoutes_routes_1.default);
router.use('/task', taskRoutes_routes_1.default);
exports.default = router;
