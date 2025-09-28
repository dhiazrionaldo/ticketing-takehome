//Data model for Ticket
export class Ticket {
  constructor(
    public id: string,
    public event_id: string,
    public name: string,
    public price: number,
    public qty_total: number,
    public created_at: string | null,
    public event?: Event //add event details for relational data
  ) {}
}

