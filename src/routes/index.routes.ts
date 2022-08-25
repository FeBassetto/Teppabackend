import { Router } from "express";
import tasksRouter from "./taskRoutes.routes";
import userRouter from "./userRoutes.routes";

const router = Router()

router.get('/', (req, res) => {
    res.send('Hello World!')
})
router.use('/user', userRouter)
router.use('/task', tasksRouter)

export default router