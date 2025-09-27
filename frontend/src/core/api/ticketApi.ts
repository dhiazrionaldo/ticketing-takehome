// src/core/api/eventApi.ts
import { ApiClient } from "./apiClient";
import { Ticket } from "@/core/models/Ticket";
import { Event } from "@/core/models/Event";

export class TicketApi {
  private client: ApiClient;

  constructor(baseUrl: string) {
    this.client = new ApiClient(baseUrl);
  }

   /**
   * list tickets for an event (with event join)
   * TODO: Add pagination in the future
   */
  async listTicketsByEvent(eventId: string): Promise<Ticket[]> {
    const data = await this.client.request<any[]>(
      `/tickets/event/${eventId}`,
      { method: "GET" }
    );

    return data.map((row) => {
      const event = row.event
        ? new Event(
            row.event.id,
            row.event.title,
            row.event.description,
            row.event.venue,
            row.event.start_time,
            row.event.end_time,
            row.event.capacity
          )
        : undefined;

      return new Ticket(
        row.id,
        row.event_id,
        row.name,
        row.price,
        row.qty_total,
        row.created_at,
        event
      );
    });
  }

  /**
   * create ticket under event
   */
  async createTicket(payload: Partial<Ticket>,token?: string): Promise<Ticket> {
    if (!token) throw new Error("Admin token required to create ticket");
    
    const row = await this.client.request<any>(`/tickets`, {
      method: "POST",
      data: payload,
    }
    , token);

    return new Ticket(
      row.id,
      row.event_id,
      row.name,
      row.price,
      row.qty_total,
      row.created_at
    );
  }

  /**
   * update ticket
   */
  async updateTicket(
    payload: Partial<Ticket>,
    token?: string
  ): Promise<Ticket> {
    if (!token) throw new Error("Admin token required to update ticket");
    
    const row = await this.client.request<any>(`/tickets/`, {
      method: "PUT",
      data: payload,
    }
    , token);

    return new Ticket(
      row.id,
      row.event_id,
      row.name,
      row.price,
      row.qty_total,
      row.created_at
    );
  }

  /**
   * delete ticket
   */
  async deleteTicket(id: string, token?: string): Promise<void> {
    if (!token) throw new Error("Admin token required to delete ticket");
    
    await this.client.request<void>(`/tickets/`, { method: "DELETE", data: {id} }, token);
  }
}

// Singleton export
export const ticketApi = new TicketApi(process.env.NEXT_PUBLIC_API_URL!);
