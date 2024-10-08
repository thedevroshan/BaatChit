import { createTransport } from 'nodemailer'
import { configuration } from '../config/config.js'

export const Transporter = createTransport({
    service: 'gmail',  // Use any other service like 'yahoo', 'outlook' if needed
    auth: {
        user: configuration.EMAIL,  // Your email id
        pass: configuration.EMAIL_PASS    // Your email password (you may need to enable 'Less secure app access' in Gmail settings or use an app-specific password)
    }
})
