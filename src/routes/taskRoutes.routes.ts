import { Router } from 'express';
import TaskController from '../controllers/TaskController';
import VerifyToken from '../helpers/VerifyToken';


const tasksRouter = Router()

tasksRouter.get('/', VerifyToken, TaskController.getAllTasks)
tasksRouter.get('/:id', VerifyToken, TaskController.getTask)
tasksRouter.post('/create', VerifyToken, TaskController.createTask)
tasksRouter.patch('/edit/:id', VerifyToken, TaskController.updateTask)
tasksRouter.delete('/delete/:id', VerifyToken, TaskController.deleteTask)

export default tasksRouter