"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@firebase/util");
class User {
    constructor(name, email, password, image, phone) {
        this.id = (0, util_1.uuidv4)();
        this.name = name;
        this.email = email;
        this.password = password;
        this.image = image;
        this.phone = phone;
    }
}
exports.default = User;
