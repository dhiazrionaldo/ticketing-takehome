import { BaseRepo } from './BaseRepo';
import { Event } from '../models/Events';

export class EventRepo extends BaseRepo {
  async getAll(): Promise<Event[]> {
    //TODO: Get all data for events from Supabase
    const { data, error } = await this.client.from('events').select('*').order('start_time', { ascending: true });
    
    //Throw error if any issues
    if (error) throw new Error(error.message);
    
    //Return empty array if no data found and map data to Event model
    return (data ?? []).map((r: any) => new Event(
      r.id, r.title, r.description, r.venue,
      r.start_time, r.end_time, r.capacity,
      r.created_by, r.created_at
    ));
  }

  async getById(id: string): Promise<Event | null> {
    //TODO: Get data based on ID for events from Supabase
    const { data, error } = await this.client.from('events').select('*').eq('id', id).single();
    
    //Throw error if any issues
    if (error) throw new Error(error.message);

    //Return null if no data found
    if (!data) return null;

    //Map data to Event model and return
    return new Event(data.id, data.title, data.description, data.venue, data.start_time, data.end_time, data.capacity, data.created_by, data.created_at);
  }

  async create(payload: Partial<Event>): Promise<Event> {
    //TODO: Create new event data on Supabase
    const { data, error } = await this.client.from('events').insert(payload).select().single();
    
    //Throw error if any issues
    if (error) throw new Error(error.message);
    
    //Map data to Event model and return
    return new Event(data.id, data.title, data.description, data.venue, data.start_time, data.end_time, data.capacity, data.created_by, data.created_at);
  }

  async edit(payload: Partial<Event>): Promise<Event> {
    //TODO: Update event data on Supabase based on ID
    const { data, error } = await this.client.from('events').update(payload).eq('id', payload.id).select().single();
    
    //Throw error if any issues
    if (error) throw new Error(error.message);
    
    //Map data to Event model and return
    return new Event(data.id, data.title, data.description, data.venue, data.start_time, data.end_time, data.capacity, data.created_by, data.created_at);
  }

  
  async delete(payload: Partial<Event>): Promise<Event> {
    //TODO: Delete event data on Supabase based on ID
    const { data, error } = await this.client.from('events').delete().eq('id', payload.id).select().single();
    
    //Throw error if any issues
    if (error) throw new Error(error.message);
    
    //Map data to Event model and return
    return new Event(data.id, data.title, data.description, data.venue, data.start_time, data.end_time, data.capacity, data.created_by, data.created_at);
  }
}
