// src/core/models/Ticket.ts
import { Event } from "./Event";

export class Ticket {
  constructor(
    public id: string,
    public event_id: string,
    public name: string,
    public price: number,
    public qty_total: number,
    public created_at: string | null,
    public event?: Event // Event relation
  ) {}
}
