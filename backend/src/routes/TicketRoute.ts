import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { verifySupabaseToken } from '../middleware/verifySupabaseToken';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router(); //TODO: initialize router instance
const ctrl = new TicketController(); //TODO: initialize controller instance

router.get('/', ctrl.getAvailableTicket); // TODO: public access to get all available ticket 
router.get('/ticket/:ticketId', ctrl.getTicketById); // TODO: public access to get ticket by id
router.get('/event/:eventId', ctrl.listByEvent); // TODO: public access to get list by event
router.post('/', verifySupabaseToken, requireAdmin, ctrl.create); //TODO: only admin can create the ticket
router.put('/', verifySupabaseToken, requireAdmin, ctrl.edit); //TODO: only admin can edit the ticket
router.delete('/', verifySupabaseToken, requireAdmin, ctrl.delete); //TODO: only admin can delete the ticket

export default router;