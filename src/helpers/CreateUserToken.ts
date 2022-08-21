import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";

const createUserToken = async (user: User, req: Request, res: Response): Promise<Response> => {

    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, `${config.SECRET_ID}`)

    return res.status(200).json({
        message: 'Usuário autenticado',
        token,
        userId: user.id
    })
}

export default createUserToken