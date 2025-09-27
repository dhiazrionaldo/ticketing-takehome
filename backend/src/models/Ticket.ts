// Data model for Event (simplified)
export class Event {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public start_date: string,
    public end_date: string,
    public venue: string,
    public capacity: number
  ) {}
}
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

