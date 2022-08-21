"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@firebase/util");
class Task {
    constructor(title, description, limitDate, user) {
        this.id = (0, util_1.uuidv4)();
        this.title = title.toUpperCase();
        this.description = description;
        this.createdAt = new Date();
        this.limitDate = new Date(Number(limitDate) * 1000);
        this.concluded = false;
        this.user = user;
    }
}
exports.default = Task;
