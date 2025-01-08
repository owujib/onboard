import { Router } from 'express'
import AuthController from '../controller/api/AuthController';

const router = Router();

router.post('/create-account', AuthController.createUser);
router.post('/login', AuthController.loginUser);
// router.post('/login', AuthController.loginUser);

export default router;