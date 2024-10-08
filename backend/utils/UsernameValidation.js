import { body } from 'express-validator'

export const UesrnameValidation = [
    body('username')
    .custom(value => {
      if (/\s/.test(value)) {
        throw new Error('Spaces are not allowed');
      }
      return true;
    })
    .isLowercase()
    .withMessage('Username should in lowercase')
]