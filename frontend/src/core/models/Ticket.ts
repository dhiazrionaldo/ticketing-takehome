//TODO: Model data for Ticket
export class Ticket {
  constructor(
    public id: string,
    public event_id: string,
    public name: string,
    public price: number,
    public qty_total: number
  ) {}
}
