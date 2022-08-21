"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("cors"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true, origin: 'http://localhost:8080' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('src/public'));
app.use('/images', express_1.default.static('images'));
app.use(index_routes_1.default);
app.listen(8080, () => {
    console.log(`Server listening port ${config_1.default.PORT}`);
});
