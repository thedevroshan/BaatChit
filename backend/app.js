import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Config File
import { configuration } from './config/config.js'

// Database
import { connectMongoDB } from './db/connectMongoDB.js'

// Routes
import authRoute from './routes/AuthRoute.js'
import userRoute from './routes/UserRoute.js'
import serverRoute from './routes/ServerRoute.js'



const app = express()


connectMongoDB()

// Middlewares
app.use(cors({
  origin: `${configuration.FRONTEND_HOST}${configuration.FRONTEND_PORT}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
  
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

// API
// Authentication
app.use('/api/auth', authRoute)

// User
app.use('/api/user', userRoute)

// Server
app.use('/api/server', serverRoute)




app.listen(configuration.PORT, () => {
  console.log(`Server is running at  ${configuration.HOST}${configuration.PORT}`)
})