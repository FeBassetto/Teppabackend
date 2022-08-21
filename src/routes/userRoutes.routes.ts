import { Router } from "express";
import UserController from "../controllers/UserController";
import uploadImage from "../helpers/UploadImage";
import VerifyToken from "../helpers/VerifyToken";

const userRouter = Router()

userRouter.get('/', VerifyToken, UserController.getUserData)
userRouter.post('/login', UserController.login)
userRouter.post('/register', uploadImage.single('image'), UserController.register)
userRouter.patch('/edit', uploadImage.single('image'), VerifyToken, UserController.editUserData)
userRouter.delete('/delete', VerifyToken, UserController.deleteUser)

export default userRouter