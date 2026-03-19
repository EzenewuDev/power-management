import { Router } from 'express';
import { register, login, getProfile, getUsers } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/', authenticate, authorize(['super_admin']), getUsers);

export default router;
