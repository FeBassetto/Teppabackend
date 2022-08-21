import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import getToken from './GetToken'

const VerifyToken = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = getToken(req)

        try {
            jwt.verify(token, String(config.SECRET_ID))
            next()

        } catch (err) {
            return res.status(401).json({ message: "Token inválido!" })
        }

    } catch (err) {
        return res.status(401).json({ message: "Access denied!" })
    }

}

export default VerifyToken