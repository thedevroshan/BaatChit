import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// Database
import { connectMongoDB } from './db/connectMongoDB.js'

// Routes
import authRoute from './routes/AuthRoute.js'


const app = express()

dotenv.config()

connectMongoDB()

// Middlewares
app.use(express.json())
app.use(cookieParser())

// API
app.use('/api/auth', authRoute)




app.listen(process.env.PORT, () => {
  console.log(`Server is running at  ${process.env.HOST}${process.env.PORT}`)
})