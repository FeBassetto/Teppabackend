import { uuidv4 } from "@firebase/util";

class User {
    id: String;
    name: String;
    email: String;
    password: String;
    image: String;
    phone: Number;

    constructor(name: String, email: String, password: String, image: String, phone: Number) {
        this.id = uuidv4()
        this.name = name
        this.email = email
        this.password = password
        this.image = image
        this.phone = phone
    }

}

export default User