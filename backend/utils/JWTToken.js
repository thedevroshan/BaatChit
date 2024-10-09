import jwt from "jsonwebtoken";
import { configuration } from "../config/config.js";

export const CreateJWTToken = async (userId, jwt_secret) => {
    try {
        const token = await jwt.sign(userId, jwt_secret,{algorithm: 'HS512'})
        if(!token){
            throw new Error('Unable to sign token')
        }
        else {
            return token
        }
    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        throw new Error('Some Error occurred in JWTToken.js File')
    }
}