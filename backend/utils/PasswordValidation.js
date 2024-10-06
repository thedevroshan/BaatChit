import { body } from 'express-validator'

export const PasswordValidation = [
    body('password') || body('new_password')
        .isLength({ min: 3 }).withMessage('Password should atleast contain 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
]