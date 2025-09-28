//TODO: Model data for Order
import { Event } from "./Event";
import { Ticket } from "./Ticket";

export class Order {
  constructor(
    public id: string,
    public user_id: string,
    public event_id: string,
    public ticket_id: string,
    public qty: number,
    public total_amount: number,
    public status: string,
    public event?: Event, // Event relation
    public ticket?: Ticket // Ticket relation
  ) {}
}
