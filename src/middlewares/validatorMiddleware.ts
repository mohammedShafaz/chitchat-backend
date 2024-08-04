import { body, check, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


export const validateUserRegistration = [
    body('firstName').notEmpty().withMessage('firstName is required'),
    body('lastName').notEmpty().withMessage('lastName is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid Email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    validate
]

export const validateEmailVerification = [
    body('email').isEmail().withMessage('Invalid Email address'),
    body('otp').notEmpty().withMessage('otp is required'),
    validate
]

export const validateParamsId=[
    param('id').notEmpty().withMessage("post id is required"), validate
]