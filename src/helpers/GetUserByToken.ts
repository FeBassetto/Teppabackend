import { getDocs, query, collection, where } from 'firebase/firestore';
import { Response } from "express"
import jwt from "jsonwebtoken"
import config from "../config"

import db from '../db';

const getUserByToken = async (token: string, res: Response) => {

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado!' })
    }

    const decoded: any = jwt.verify(token, String(config.SECRET_ID))

    const userId = decoded.id

    let userAlreadyExists: Array<any> = []

    const q = query(collection(db, "users"), where("id", "==", userId))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        userAlreadyExists.push(doc.data())
    });

    const user = userAlreadyExists[0]

    return user

}

export default getUserByToken