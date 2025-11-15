import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('phone').optional().isMobilePhone('any'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('categoryId').isUUID().withMessage('Valid category ID is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('startDatetime').isISO8601().withMessage('Valid start date is required'),
  body('endDatetime').isISO8601().withMessage('Valid end date is required'),
];