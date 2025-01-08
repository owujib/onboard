import { NextFunction, Request, Response, Router } from 'express'
import AuthController from '../controller/api/AuthController';
import { authenticateUser } from '../middleware/authMiddleware';
import { ResponseUtil } from '../utils/response';

const router = Router();

router.post('/create-account', AuthController.createUser);
router.post('/login', AuthController.loginUser);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/recover-password', AuthController.recoverPassword);
router.post('/resend-auth-code', AuthController.resendAuthCode);

router.get('/me', authenticateUser, (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        ResponseUtil.sendSuccessResponse(res, {
            email: user?.email,
            name: user?.name,
        })
        return
    } catch (error) {
        return next(error)
    }
})

export default router;