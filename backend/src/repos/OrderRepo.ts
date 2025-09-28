import { BaseRepo } from './BaseRepo';
import { Order } from '../models/Order';
import { Ticket } from '../models/Ticket';
import { Event } from '../models/Events';

export class OrderRepo extends BaseRepo {
  /**
   * Calls the purchase_ticket RPC (Supabase Database Function) to atomically create order & decrement ticket qty.
   * Returns the new order as an object.
   */
  async purchaseTicket(ticket_id: string, user_id: string, qty: number, total_amount: number): Promise<Order> {
    //TODO: Call RPC
    const { data, error } = await this.client.rpc('purchase_ticket', {
      p_ticket_id: ticket_id,
      p_user_id: user_id,
      p_qty: qty,
      p_total_amount: total_amount
    }).single();

    //Throw error if any issues
    if (error) throw new Error(error.message);

    // RPC returns: order_id, user_id, event_id, ticket_id, qty, total_amount, status, created_at
    const row: any = data;
    //Map data to Order model and return
    return new Order(row.order_id, row.user_id, row.event_id, row.ticket_id, row.qty, row.total_amount, row.status, row.created_at);
  }

  async findById(id: string): Promise<Order | null> {
    //TODO: Get order data based on ID from Supabase
    const { data, error } = await this.client.from('orders').select('*').eq('id', id).single();
    
    //Throw error if any issues
    if (error) throw new Error(error.message);
    //Return null if no data found
    if (!data) return null;

    //Map data to Order model and return
    return new Order(data.id, data.user_id, data.event_id, data.ticket_id, data.qty, data.total_amount, data.status, data.created_at);
  }

  async getByTicket(ticket_id: string): Promise<Order[]> {
  // Get tickets with joined events
  const { data, error } = await this.client
      .from("orders")
      .select(
      `
      id,
      user_id,
      event_id,
      ticket_id,
      qty,
      total_amount,
      status,
      created_at,
      events (
        id,
        title,
        description,
        venue,
        capacity,
        start_time,
        end_time
      ),
      tickets (
        id,
        event_id,
        name,
        price,
        qty_total
      )
      `
      )
      .eq("ticket_id", ticket_id);
  
      console.log(data);
  if (error) throw new Error(error.message);
  if (!data) return [];

  // Map rows to Ticket instances
  return data.map((row: any) => {
      const event = row.events
      ? new Event(
          row.events.id,
          row.events.title,
          row.events.description,
          row.events.venue,
          row.events.capacity,
          row.events.start_time,
          row.events.end_time
          )
      : undefined;

      const ticket = row.tickets
      ? new Ticket(
          row.tickets.id,
          row.tickets.event_id,
          row.tickets.name,
          row.tickets.price,
          row.tickets.qty_total
          )
      : undefined;

      return new Order(
      row.id,
      row.user_id,
      row.event_id,
      row.ticket_id,
      row.qty,
      row.total_amount,
      row.status,
      row.created_at,
      event,
      ticket
      );
  });
}
}
