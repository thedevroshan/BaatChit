import { body } from 'express-validator'

export const EmailValidation = [
    body('email')
    .isEmail()
    .withMessage('Email is required')
]