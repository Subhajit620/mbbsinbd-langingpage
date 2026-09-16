import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { validateAuthLogin } from '../validators/leadValidator.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', validateAuthLogin, login);
router.get('/me', protectAdmin, getMe);

export default router;
