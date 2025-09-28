import { BaseRepo } from './BaseRepo';
import { Ticket } from '../models/Ticket';
import { EventRepo } from './EventRepo';
import { Event } from '../models/Events';

export class TicketRepo extends BaseRepo {
    async getAllAvailTickets(): Promise<Ticket[]> {
        // Get tickets with joined events
        const { data, error } = await this.client
            .from("tickets")
            .select(`
                id,
                event_id,
                name,
                price,
                qty_total,
                created_at,
                events (
                    id,
                    title,
                    description,
                    venue,
                    capacity,
                    start_time,
                    end_time
                )
            `)
            .gt("qty_total",0);
       // Map rows to Ticket instances
        return data.map((row: any) => {
            const event = row.events
            ? new Event(
                row.events.id,
                row.events.title,
                row.events.description,
                row.events.venue,
                row.events.capacity,
                row.events.start_time,
                row.events.end_time
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
    
    async getByTicketId(ticketId: string): Promise<Ticket[]> {
        // Get tickets with joined events
        const { data, error } = await this.client
            .from("tickets")
            .select(
            `
            id,
            event_id,
            name,
            price,
            qty_total,
            created_at,
            events (
                id,
                title,
                description,
                venue,
                capacity,
                start_time,
                end_time
            )
            `
            )
            .eq("id", ticketId);

        if (error) throw new Error(error.message);
        if (!data) return [];

        // Map rows to Ticket instances
        return data.map((row: any) => {
            const event = row.events
            ? new Event(
                row.events.id,
                row.events.title,
                row.events.description,
                row.events.venue,
                row.events.capacity,
                row.events.start_time,
                row.events.end_time
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

    async getByEvent(event_id: string): Promise<Ticket[]> {
        // Get tickets with joined events
        const { data, error } = await this.client
            .from("tickets")
            .select(
            `
            id,
            event_id,
            name,
            price,
            qty_total,
            created_at,
            events (
                id,
                title,
                description,
                venue,
                capacity,
                start_time,
                end_time
            )
            `
            )
            .eq("event_id", event_id);

        if (error) throw new Error(error.message);
        if (!data) return [];

        // Map rows to Ticket instances
        return data.map((row: any) => {
            const event = row.events
            ? new Event(
                row.events.id,
                row.events.title,
                row.events.description,
                row.events.venue,
                row.events.capacity,
                row.events.start_time,
                row.events.end_time
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


    async getById(id: string): Promise<Ticket | null> {
        //TODO: Get ticket data based on ID from Supabase
        const { data, error } = await this.client.from('tickets').select('*, events(id, title, description, venue, capacity, start_time, end_time)').eq('id', id).single();
        
        //Throw error if any issues
        if (error) throw new Error(error.message);

        //Return null if no data found
        if (!data) return null;

        // Map to Event if available
        const event = data.events
            ? new Event(
                data.events.id,
                data.events.title,
                data.events.description,
                data.events.venue,
                data.events.capacity,
                data.events.start_date,
                data.events.end_date
            )
            : undefined;

        // Return mapped Ticket with optional Event
        return new Ticket(
            data.id,
            data.event_id,
            data.name,
            data.price,
            data.qty_total,
            data.created_at,
            event
        );
    }

    async create(payload: Partial<Ticket>): Promise<Ticket> {
        //TODO: Create new ticket data on Supabase
        const { data, error } = await this.client.from('tickets').insert(payload).select().single();
        
        
        //Throw error if event is not found
        const event = await new EventRepo().getById(payload.event_id!);
        if (!event) throw new Error('Event not found!');
        
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
