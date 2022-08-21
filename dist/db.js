"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
require("firebase/firestore");
const config_1 = __importDefault(require("./config"));
const app = (0, app_1.initializeApp)(config_1.default.firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
exports.default = db;
