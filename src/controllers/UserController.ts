import db from "../db";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import fs from 'fs'
import User from "../models/User";
import { Request, Response } from "express";
import createUserToken from "../helpers/CreateUserToken";
import bcrypt from 'bcrypt'
import getToken from "../helpers/GetToken";
import getUserByToken from "../helpers/GetUserByToken";


class UserController {

    static async register(req: Request, res: Response) {

        //Get informations
        const { name, email, password, confirmpassword, phone } = req.body

        let image = ''

        if (req.file) {
            image = req.file.filename
        }

        const pathImage = `src/public/images/users/${image}`

        if (!req.file) {
            image = 'nullimage.jpg'
        }

        //Validations
        if (!name) {
            fs.unlink(pathImage, (err) => { })
            return res.status(422).json({ message: 'Digite um nome válido' })
        }
        if (!email) {
            fs.unlink(pathImage, (err) => { })
            return res.status(422).json({ message: 'Digite um email válido' })
        }

        let userAlreadyExists: Array<any> = []

        const q = query(collection(db, "users"), where("email", "==", email))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            userAlreadyExists.push(doc.data())
        });


        if (userAlreadyExists.length > 0) {
            fs.unlink(pathImage, (err) => { })
            return res.status(422).json({ message: 'Este email já está cadastrado' })
        }

        if (!password || password !== confirmpassword) {
            fs.unlink(pathImage, (err) => { })
            return res.status(422).json({ message: 'Senha está incorreta' })
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)


        if (!phone) {
            fs.unlink(pathImage, (err) => { })
            return res.status(422).json({ message: 'Digite um telefone válido' })
        }

        //New user
        const user = new User(name, email, passwordHash, image, phone)

        try {

            await setDoc(doc(db, "users", String(user.id)), {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                image: user.image,
                phone: user.phone
            });

            await createUserToken(user, req, res)

        } catch (err) {
            fs.unlink(pathImage, (err) => { })
            res.status(500).json({ message: err })
        }
    }

    static async login(req: Request, res: Response) {

        const { email, password } = req.body

        //Validations
        if (!email) {
            return res.status(422).json({ message: 'Digite um email válido' })
        }

        if (!password) {
            return res.status(422).json({ message: 'Digite uma senha válida' })
        }

        let userAlreadyExists: Array<any> = []

        const q = query(collection(db, "users"), where("email", "==", email))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            userAlreadyExists.push(doc.data())
        });

        if (userAlreadyExists.length < 1) {
            return res.status(422).json({ message: "Usuário não existe" })
        }

        const user = userAlreadyExists[0]

        //check if password match with db
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(422).json({ message: 'invalid password' })
        }

        await createUserToken(user, req, res)

    }

    static async getUserData(req: Request, res: Response) {

        const token = getToken(req)
        const user = await getUserByToken(token, res)

        try {
            delete user.password
            delete user.id
        } catch (err) {
            return res.status(422).json({ message: 'Usuário inválido' })
        }

        return res.json({ message: user })


    }

    static async editUserData(req: Request, res: Response) {

        const { name, email, password, phone, noImage } = req.body

        let image

        if (req.file) {
            image = req.file.filename
        }

        let updatedData = {}

        if (name) {
            updatedData = { ...updatedData, name: name }
        }
        if (email) {
            updatedData = { ...updatedData, email: email }
        }
        if (password) {
            updatedData = { ...updatedData, password: password }
        }
        if (phone) {
            updatedData = { ...updatedData, phone: phone }
        }
        if (image) {
            updatedData = { ...updatedData, image: image }
        }

        const token = getToken(req)
        const user = await getUserByToken(token, res)

        const pathImage = `src/public/images/users/${user.image}`

        if (noImage) {
            updatedData = { ...updatedData, image: 'nullimage.jpg' }
            if (user.image !== 'nullimage.jpg') {
                fs.unlink(pathImage, (err) => console.log(err))
            }
        }

        if (Object.keys(updatedData).length < 1) {
            return res.status(422).json({ message: 'Nenhum dado recebido' })
        }

        try {
            const userRef = doc(db, 'users', String(user.id))
            await updateDoc(userRef, updatedData)
            return res.json({ message: 'Usuário atualizado com sucesso' })
        } catch (error) {
            return res.status(422).json({ message: 'Usuário inválido' })
        }

    }

    static async deleteUser(req: Request, res: Response) {

        const token = getToken(req)
        const user = await getUserByToken(token, res)

        if (!user) {
            return res.json({ message: 'Token está inválido!' })
        }

        const image = user.image === 'nullimage.jpg' ? null : user.image

        const pathImage = `src/public/images/users/${image}`

        try {
            const userRef = doc(db, 'users', String(user.id))
            await deleteDoc(userRef)
            if (image !== null) {
                fs.unlink(pathImage, (err) => console.log(err))
            }
            return res.json({ message: "Usuário deletado com sucesso" })
        } catch (err) {
            return res.status(422).json({ message: 'Não foi possivel deletar o usuário' })
        }
    }


}

export default UserController