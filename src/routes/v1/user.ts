/**
 * @description: node modules
 */
import { Router } from 'express';
import { param, query, body } from 'express-validator';

/**
 * @description: controllers
 */
import GetCurrentUserController from '@/controllers/v1/user/get-current-user';

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

export default router;
