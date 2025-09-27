import { ApiClient } from "../api/apiClient";
import { Event } from "../models/Event";

/**
 * EventCache (internal class)
 *
 * Purpose:
 *  - Keep cached copy of events in memory.
 *  - Prevent unnecessary API calls (like react-query does).
 *  - Supports TTL (time-to-live) to auto-expire old cache.
 */
class EventCache {
  private static cache: Event[] | null = null;
  private static lastFetch: number = 0;
  private static ttl = 1000 * 60; // cache expires after 1 min

  static get(): Event[] | null {
    if (!this.cache) return null;
    const isExpired = Date.now() - this.lastFetch > this.ttl;
    return isExpired ? null : this.cache;
  }

  static set(events: Event[]) {
    this.cache = events;
    this.lastFetch = Date.now();
  }

  static clear() {
    this.cache = null;
  }
}

/**
 * EventService
 *
 * Purpose:
 *  - Business logic wrapper for all Event API calls.
 *  - Handles CRUD (list, add, update, delete).
 *  - Keeps cache in sync with backend.
 */
export class EventService {
  constructor(private api: ApiClient) {}

  /**
   * listEvents
   * Input: forceRefresh (default = false)
   * Output: array of Event objects
   * Behavior:
   *  - Returns cached events if available.
   *  - If forceRefresh = true or cache expired → fetch from backend.
   */
  async listEvents(forceRefresh = false): Promise<Event[]> {
    if (!forceRefresh) {
      const cached = EventCache.get();
      if (cached) return cached;
    }

    const data = await this.api.request<any[]>("/events");

    const events = data.map(
      (e) =>
        new Event(
          e.id,
          e.title,
          e.description,
          e.venue,
          e.start_time,
          e.end_time,
          e.capacity
        )
    );

    EventCache.set(events);
    return events;
  }

  /**
   * addEvent
   * Input: Event object
   * Output: New Event object (from backend with generated id)
   * Behavior:
   *  - POST to backend
   *  - Add new event to cache immediately
   */
  async addEvent(event: Event): Promise<Event> {
    const data = await this.api.request<any>("/events", {
      method: "POST",
      data: event, // axios uses "data" instead of "body"
    });

    const newEvent = new Event(
      data.id,
      data.title,
      data.description,
      data.venue,
      data.start_time,
      data.end_time,
      data.capacity
    );

    const cached = EventCache.get() ?? [];
    EventCache.set([...cached, newEvent]);

    return newEvent;
  }

  /**
   * updateEvent
   * Input: Event object with updated fields
   * Output: Updated Event object
   * Behavior:
   *  - PUT to backend
   *  - Replace event in cache
   */
  async updateEvent(event: Event): Promise<Event> {
    const data = await this.api.request<any>(`/events/${event.id}`, {
      method: "PUT",
      data: event,
    });

    const updated = new Event(
      data.id,
      data.title,
      data.description,
      data.venue,
      data.start_time,
      data.end_time,
      data.capacity
    );

    const cached = EventCache.get() ?? [];
    const newCache = cached.map((e) => (e.id === updated.id ? updated : e));
    EventCache.set(newCache);

    return updated;
  }

  /**
   * deleteEvent
   * Input: Event id (string)
   * Output: void
   * Behavior:
   *  - DELETE request to backend
   *  - Remove event from cache
   */
  async deleteEvent(id: string): Promise<void> {
    await this.api.request(`/events/${id}`, {
      method: "DELETE",
    });

    const cached = EventCache.get() ?? [];
    const newCache = cached.filter((e) => e.id !== id);
    EventCache.set(newCache);
  }
}
