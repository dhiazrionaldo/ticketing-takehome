import { BaseRepo } from './BaseRepo';
import { Ticket } from '../models/Ticket';

export class TicketRepo extends BaseRepo {

    async getByEvent(event_id: string): Promise<Ticket[]> {
        //TODO: Get ticket data by events from Supabase
        const { data, error } = await this.client.from('tickets').select('*').eq('event_id', event_id);

        //Throw error if any issues
        if (error) throw new Error(error.message);

        //Return empty array if no data found and map data to Ticket model
        return (data ?? []).map((r: any) => new Ticket(r.id, r.event_id, r.name, r.price, r.qty_total, r.created_at));
    }

    async getById(id: string): Promise<Ticket | null> {
        //TODO: Get ticket data based on ID from Supabase
        const { data, error } = await this.client.from('tickets').select('*').eq('id', id).single();
        
        //Throw error if any issues
        if (error) throw new Error(error.message);

        //Return null if no data found
        if (!data) return null;

        //Map data to Ticket model and return the ticket
        return new Ticket(data.id, data.event_id, data.name, data.price, data.qty_total, data.created_at);
    }

    async create(payload: Partial<Ticket>): Promise<Ticket> {
        //TODO: Create new ticket data on Supabase
        const { data, error } = await this.client.from('tickets').insert(payload).select().single();
        
        //Throw error if any issues
        if (error) throw new Error(error.message);
        
        //Map data to Ticket model and return the created ticket
        return new Ticket(data.id, data.event_id, data.name, data.price, data.qty_total, data.created_at);
    }

    async edit(payload: Partial<Ticket>): Promise<Ticket> {
        //TODO: Update ticket data on Supabase based on ID
        const { data, error } = await this.client.from('tickets').update(payload).eq('id', payload.id).select().single();
        
        //Throw error if any issues
        if (error) throw new Error(error.message);
        
        //Map data to ticket model and return edited ticket
        return new Ticket(data.id, data.event_id, data.name, data.price, data.qty_total, data.created_at);
    }


    async delete(payload: Partial<Ticket>): Promise<Ticket> {
        //TODO: Delete ticket data on Supabase based on ID
        const { data, error } = await this.client.from('tickets').delete().eq('id', payload.id).select().single();
        
        //Throw error if any issues
        if (error) throw new Error(error.message);
        
        //Map data to ticket model and return the deleted ticket
        return new Ticket(data.id, data.event_id, data.name, data.price, data.qty_total, data.created_at);
    }
}
