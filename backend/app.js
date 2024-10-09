import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Config File
import { configuration } from './config/config.js'

// Database
import { connectMongoDB } from './db/connectMongoDB.js'

// Routes
import authRoute from './routes/AuthRoute.js'


const app = express()


connectMongoDB()

// Middlewares
app.use(cors({
  origin: `${configuration.FRONTEND_HOST}${configuration.FRONTEND_PORT}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
  
}))
app.use(express.json())
app.use(cookieParser())

// API
app.use('/api/auth', authRoute)




app.listen(configuration.PORT, () => {
  console.log(`Server is running at  ${configuration.HOST}${configuration.PORT}`)
})