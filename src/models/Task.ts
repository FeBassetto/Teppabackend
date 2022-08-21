import { uuidv4 } from '@firebase/util';
import User from './User';

class Task {
    id: String;
    title: String
    description: String;
    createdAt: Date;
    limitDate: Date;
    concluded: boolean;
    user: User;

    constructor(title: String, description: String, limitDate: Date, user: User) {
        this.id = uuidv4()
        this.title = title.toUpperCase()
        this.description = description
        this.createdAt = new Date()
        this.limitDate = new Date(Number(limitDate) * 1000)
        this.concluded = false
        this.user = user
    }
}

export default Task