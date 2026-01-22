import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/user-controller';

const authRoutes = Router();

authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);

export default authRoutes;
