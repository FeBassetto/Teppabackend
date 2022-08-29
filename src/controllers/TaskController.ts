import { deleteDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { getDocs, startAfter, startAt } from 'firebase/firestore';
import { where } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { Request, Response } from "express"
import db from "../db"
import getToken from "../helpers/GetToken"
import getUserByToken from "../helpers/GetUserByToken"
import Task from "../models/Task"

class TaskController {

    static async createTask(req: Request, res: Response) {

        const { title, description, limitDate } = req.body

        const token = getToken(req)
        const user = await getUserByToken(token, res)

        delete user.password

        if (!title) {
            return res.status(422).json({ message: 'Título inválido!' })
        }

        if (!description) {
            return res.status(422).json({ message: 'Descrição inválido!' })
        }

        if (!limitDate) {
            return res.status(422).json({ message: 'Data limite inválida!' })
        }

        if (!user) {
            return res.status(422).json({ message: 'Token inválido!' })
        }

        const task = new Task(title, description, limitDate, user)

        try {

            await setDoc(doc(db, "tasks", String(task.id)), {
                id: task.id,
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                limitDate: task.limitDate,
                concluded: task.concluded,
                user: task.user
            });

            return res.json({ message: 'Task criada com sucesso!' })

        } catch (err) {

            return res.status(422).json({ message: 'Não foi possível cadastrar a Task, tente novamente.' })

        }

    }

    static async getTask(req: Request, res: Response) {

        const { id } = req.params

        let taskAlreadyExists: Array<any> = []

        const q = query(collection(db, "tasks"), where("id", "==", id))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            taskAlreadyExists.push(doc.data())
        });

        if (taskAlreadyExists.length < 1) {
            return res.status(422).json({ message: 'Task com id pesquisado não existe!' })
        }

        const task = taskAlreadyExists[0]

        const token = getToken(req)
        const user = await getUserByToken(token, res)

        if (task.user.id !== user.id) {
            return res.status(422).json({ message: 'Token inválido!' })
        }

        delete task.user

        res.json({ task })

    }

    static async getAllTasks(req: Request, res: Response) {

        const { title, concluded } = req.query

        const token = getToken(req)
        const user = await getUserByToken(token, res)

        const concludedFilter = concluded ? concluded === "false" ? false : true : false

        try {

            let tasks: Array<any> = []

            const q = query(collection(db, "tasks"), where("user.id", "==", user.id), where("concluded", "==", concludedFilter))

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                tasks.push(doc.data())
            });

            if (title) {
                const filterTasks = tasks.filter(task => {
                    if (task.title.includes(String(title).toUpperCase())) {
                        return task
                    }
                })

                return res.json({ filterTasks })
            }

            return res.json({ tasks })

        } catch (err) {
            return res.status(422).json({ message: 'Não foi possível resgatar suas Tasks!', err })
        }

    }

    static async updateTask(req: Request, res: Response) {

        const { id } = req.params
        const { title, description, limitDate, concluded } = req.body

        let taskAlreadyExists: Array<any> = []

        const q = query(collection(db, "tasks"), where("id", "==", id))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            taskAlreadyExists.push(doc.data())
        });

        if (taskAlreadyExists.length < 1) {
            return res.status(422).json({ message: 'Task com id pesquisado não existe!' })
        }

        const task = taskAlreadyExists[0]
        const token = getToken(req)
        const user = await getUserByToken(token, res)

        if (task.user.id !== user.id) {
            return res.status(422).json({ message: 'Token Inválido!' })
        }

        if (!title && !description && !limitDate && !concluded) {
            return res.status(422).json({ message: "Nenhum dado recebido!" })
        }

        let updatedTaks = {}

        if (title) {
            updatedTaks = { ...updatedTaks, title: String(title).toUpperCase() }
        }

        if (description) {
            updatedTaks = { ...updatedTaks, description: description }
        }

        if (limitDate) {
            updatedTaks = { ...updatedTaks, limitDate: limitDate }
        }

        if (concluded === true || concluded === false) {
            updatedTaks = { ...updatedTaks, concluded: concluded }
        }

        if (Object.keys(updatedTaks).length < 1) {
            return res.status(422).json({ message: 'Nenhum dado recebido!' })
        }

        try {

            const taskRef = doc(db, 'tasks', String(id))
            await updateDoc(taskRef, updatedTaks)
            return res.json({ message: 'Task atualizada com sucesso!' })

        } catch (err) {
            return res.status(422).json({ message: 'Não foi possível atualizar os dados!' })
        }

    }

    static async deleteTask(req: Request, res: Response) {

        const { id } = req.params

        let taskAlreadyExists: Array<any> = []

        const q = query(collection(db, "tasks"), where("id", "==", id))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            taskAlreadyExists.push(doc.data())
        });

        if (taskAlreadyExists.length < 1) {
            return res.status(422).json({ message: 'Task com id pesquisado não existe!' })
        }

        const task = taskAlreadyExists[0]
        const token = getToken(req)
        const user = await getUserByToken(token, res)

        if (task.user.id !== user.id) {
            return res.status(422).json({ message: 'Token inválido!' })
        }

        try {
            const taskref = doc(db, 'tasks', String(id))
            await deleteDoc(taskref)
            return res.json({ message: 'Task deletada com sucesso!' })
        } catch (err) {
            return res.status(422).json({ message: "Não foi possível deletar task!" })
        }

    }

}

export default TaskController