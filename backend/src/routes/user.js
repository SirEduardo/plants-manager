import { Router } from 'express'
import { UserController } from '../controllers/users.js'

const userRouter = Router()

userRouter.post('/login', UserController.login)
userRouter.post('/register', UserController.register)

export default userRouter
