import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { verifySupabaseToken } from '../middleware/verifySupabaseToken';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router(); //TODO: initialize router instance
const ctrl = new AuthController(); //TODO: initialize controller instance

router.get('/me', verifySupabaseToken, ctrl.getMe); //TODO: get authenticated user's profile
router.post('/profile', verifySupabaseToken, ctrl.upsertProfile); //TODO: create or update authenticated user's profile
router.post('/role', verifySupabaseToken, requireAdmin, ctrl.setRole); //TODO: only admin can set role for a profile

export default router;
