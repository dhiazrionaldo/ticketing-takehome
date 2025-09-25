//data transfer object for edit a ticket
export interface EditTicketDto {
  id: string;
  event_id: string;
  name: string;
  price: number;
  qty_total: number;
}
