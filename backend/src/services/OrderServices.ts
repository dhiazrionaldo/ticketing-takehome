import { OrderRepo } from '../repos/OrderRepo';
import { CreateOrderDto } from '../dto/CreateOrderDto';
import { TicketRepo } from '../repos/TicketRepo';
import { Order } from '../models/Order';

export class OrderService {
  private orderRepo = new OrderRepo();
  private ticketRepo = new TicketRepo();

  /**
   * Create an order using the atomic RPC function from Supabase
   * Steps:
   *  - fetch ticket to get price
   *  - compute total
   *  - call orderRepo.purchaseTicket(...)
   */
  async purchase(user_id: string, dto: CreateOrderDto): Promise<Order> {
    //TODO: Validate the ticket is exists
    const ticket = await this.ticketRepo.getById(dto.ticket_id);
    
    //Throw error if ticket not found
    if (!ticket) throw new Error('Ticket not found');
    
    //Throw error if qty is less than or equal to 0
    if (dto.qty <= 0) throw new Error('Quantity must be > 0');

    //Compute total amount 
    const total = ticket.price * dto.qty;

    // purchaseTicket RPC will throw if not enough qty
    const order = await this.orderRepo.purchaseTicket(dto.ticket_id, user_id, dto.qty, total);
    return order;
  }

  
  //TODO: Implement listByTicket method to get all tickets for a specific event
  async listByTicket(ticket_id: string): Promise<Order[]> {
      return this.orderRepo.getByTicket(ticket_id);
  }
}
