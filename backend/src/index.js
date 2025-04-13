import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import plantsRouter from './routes/plants.js'

const app = express()

app.use(
  cors({
    origin: 'https://plants-manager-front.vercel.app', // o '*' para permitir todo (no recomendado en producción)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // si usas cookies/autenticación
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
