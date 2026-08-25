/**
 * @description: node modules
 */
import { Router } from 'express';
import { body, cookie } from 'express-validator';
import bcrypt from 'bcrypt';

/**
 * @description: controllers
 */
import SignupController from '@/controllers/v1/auth/sign-up';

/**
 * @description: middlewares
 */
import ValidationError from '@/middlewares/validation-error';

/**
 * @description: prisma
 */
import { prisma } from '@/db';

const router = Router();

router.post(
  '/sign-up',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters.')
    .isEmail()
    .withMessage('Invalid Email address')
    .custom(async (value) => {
      const userExist = await prisma.user.findUnique({
        where: { email: value },
      });

      if (userExist) throw new Error('User already exists.');
    }),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ max: 50 })
    .withMessage('Username must be less than 50 characters.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
  ValidationError,
  SignupController,
);

export default router;
