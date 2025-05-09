import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import plantsRouter from './routes/plants.js'
import userRouter from './routes/user.js'
import authenticateUser from './utils/auth.js'
import notificationRoutes from './routes/notification.js'
import locationRoutes from './routes/location.js'
import './cron/wateringChecker.js'

const app = express()

const allowedOrigins = [
  'https://plants-manager-front.vercel.app',
  'http://localhost:5173',
  'http://localhost:8081'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hola mundo')
})
app.use('/plants', plantsRouter)
app.use('/users', userRouter)
app.use('/notifications', notificationRoutes)
app.use('/locations', locationRoutes)
app.get('/auth', authenticateUser, (req, res) => {
  res.sendStatus(200)
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
