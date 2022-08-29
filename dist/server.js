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
const port = config_1.default.PORT || 8080;
app.use(express_1.default.json());
const corsOptions = {
    origin: 'https://teppafrontend-c0569.web.app',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, PATCH, DELETE"
};
app.use((0, cors_1.default)(corsOptions));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('src/public'));
app.use('/images', express_1.default.static('images'));
app.use(index_routes_1.default);
app.listen(port, () => {
    console.log(`Server listening port ${port}`);
});
