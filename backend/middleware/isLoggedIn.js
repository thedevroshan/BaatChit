import jwt from 'jsonwebtoken'
import { configuration } from '../config/config.js'

export const isLoggedIn = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(400).json({ok: false, msg: 'No Token Provided'})
        }

        const user = await jwt.verify(token, configuration.JWT_SECRET)
        if(!user){
            return res.status(400).json({ok: false, msg: 'Unable to verify token'})
        }

        req.user = {
            id: user.userId
        }
        next()
    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        throw new Error('isLoggedIn Middleware Failed')        
    }
}