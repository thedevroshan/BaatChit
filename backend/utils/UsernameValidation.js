import { body } from 'express-validator'

export const UesrnameValidation = [
    body('username')
    .isLowercase()
    .withMessage('Username should in lowercase')
]