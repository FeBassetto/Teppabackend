import { Router } from "express";
import tasksRouter from "./taskRoutes.routes";
import userRouter from "./userRoutes.routes";

const router = Router()

router.use('/user', userRouter)
router.use('/task', tasksRouter)
router.get('/', (req, res) => {
    res.json({message: 'Hello World!'})
})

export default router