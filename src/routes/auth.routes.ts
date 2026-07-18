import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { requireFields, sanitizeBody, validateEmail, validatePassword } from '../middleware/validate';

const router = Router();

router.use(sanitizeBody);

router.post('/register',
  requireFields('email', 'phone', 'password', 'role', 'firstName', 'lastName'),
  validateEmail(),
  validatePassword(),
  register
);
router.post('/login',
  requireFields('email', 'password'),
  validateEmail(),
  login
);
router.get('/me', authenticate, me);

export default router;
