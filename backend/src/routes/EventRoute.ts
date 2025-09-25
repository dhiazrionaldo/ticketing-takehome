import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { verifySupabaseToken } from '../middleware/verifySupabaseToken';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router(); //TODO: initialize router instance
const ctrl = new EventController(); //TODO: initialize controller instance

router.get('/', ctrl.list); //TODO: public access to get event list
router.post('/', verifySupabaseToken, requireAdmin, ctrl.create); //TODO: only admin can create the event
router.put('/', verifySupabaseToken, requireAdmin, ctrl.edit); //TODO: only admin can edit the event
router.delete('/', verifySupabaseToken, requireAdmin, ctrl.delete); //TODO: only admin can delete the event

export default router;
