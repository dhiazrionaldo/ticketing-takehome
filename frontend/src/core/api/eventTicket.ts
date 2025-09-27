// src/core/api/eventApi.ts
import { ApiClient } from "./apiClient";
import { Event } from "@/core/models/Event";

export class EventApi {
  private client: ApiClient;

  constructor(baseUrl: string) {
    this.client = new ApiClient(baseUrl);
  }

  // list events (public, no token needed)
  async listEvents(): Promise<Event[]> {
    return this.client.request<Event[]>("/events", { method: "GET" });
  }

  // create event (requires token)
  async createEvent(payload: Partial<Event>, token: string): Promise<Event> {
    return this.client.request<Event>(
      "/events",
      { method: "POST", data: payload },
      token
    );
  }

  // update event
  async updateEvent(payload: Partial<Event>, token: string): Promise<Event> {
    return this.client.request<Event>(
      `/events/`,
      { method: "PUT", data: payload },
      token
    );
  }

  // delete event
  async deleteEvent(payload: Partial<Event>, token: string): Promise<void> {
    await this.client.request<void>(
      `/events/`,
      { method: "DELETE", data: payload },
      token
    );
  }
}

export const eventApi = new EventApi(process.env.NEXT_PUBLIC_API_URL!);
