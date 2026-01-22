import { Router } from 'express';
import { registerUser } from '../controllers/user-controller';

const authRoutes = Router();

authRoutes.post('/register', registerUser);
authRoutes.post('/login');

export default authRoutes;
