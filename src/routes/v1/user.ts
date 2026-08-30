/**
 * @description: node modules
 */
import { Router } from 'express';
import { param, query, body } from 'express-validator';

/**
 * @description: controllers
 */
import GetCurrentUserController from '@/controllers/v1/user/get-current-user';
import UpdateCurrentUserController from '@/controllers/v1/user/update-current-user';

/**
 * @description: middlewares
 */
import authenticate from '@/middlewares/authenticate';
import ValidationError from '@/middlewares/validation-error';
import verify from '@/middlewares/verify';

/**
 * @description: prisma
 */
import { prisma } from '@/db';

const router = Router();

router.get('/current', authenticate, verify(), GetCurrentUserController);

router.put(
  '/current',
  authenticate,
  verify(),
  body('email')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters.')
    .isEmail()
    .withMessage('Invalid email adress')
    .custom(async (value) => {
      const userExists = await prisma.user.findUnique({
        where: { email: value },
      });

      if (userExists) throw Error('This email adress is alredy in use.');
    }),
  body('first_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Fist name must be less than 20 characters.'),
  body('last_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters.'),
  body('name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('User name must be less than 20 characters.'),
  body('currency')
    .optional()
    .isLength({ max: 3 })
    .withMessage('Currency must be less than 3 characters.'),
  body('verify')
    .optional()
    .isBoolean()
    .withMessage('Verify must be a boolean value.'),
  ValidationError,
  UpdateCurrentUserController,
);

export default router;
