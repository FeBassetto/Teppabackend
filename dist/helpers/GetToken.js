"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getToken = (req) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(" ")[1];
    return token;
};
exports.default = getToken;
