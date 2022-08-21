import { Request } from "express"

const getToken = (req: Request): string => {

    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(" ")[1]

    return token

}

export default getToken