import { Router } from 'express'
import { UserController } from '../controllers/users.js'

const userRouter = Router()

userRouter.post('/login', UserController.login)
userRouter.post('/register', UserController.register)
userRouter.post('/logout', UserController.logout)

export default userRouter
