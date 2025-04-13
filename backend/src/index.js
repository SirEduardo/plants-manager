import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import plantsRouter from './routes/plants.js'

const app = express()

const allowedOrigins = [
  'https://plants-manager-front.vercel.app',
  'https://plants-manager-front-rcniu06fm-sireduardos-projects.vercel.app'
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  })
)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('hola mundo')
})
app.use('/plants', plantsRouter)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
