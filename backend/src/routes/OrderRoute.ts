import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { verifySupabaseToken } from '../middleware/verifySupabaseToken';

const router = Router();
const ctrl = new OrderController();

router.post('/purchase', verifySupabaseToken, ctrl.purchase);
router.get('/purchase/:ticketId', ctrl.listByTicket);

export default router;
