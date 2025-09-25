//Data model for Order
export class Order {
  constructor(
    public id: string,
    public user_id: string,
    public event_id: string,
    public ticket_id: string,
    public qty: number,
    public total_amount: number,
    public status: string,
    public created_at: string | null
  ) {}
}

