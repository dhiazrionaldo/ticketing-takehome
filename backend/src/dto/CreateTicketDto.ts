//data transfer object for creating a ticket
export interface CreateTicketDto {
  event_id: string;
  name: string;
  price: number;
  qty_total: number;
}
