import { TicketRepo } from '../repos/TicketRepo';
import { CreateTicketDto } from '../dto/CreateTicketDto';
import { Ticket } from '../models/Ticket';
import { EditTicketDto } from '../dto/EditTicketDto';

export class TicketService {
    private repo = new TicketRepo();
    
    //TODO: Implement listByEvent method to get all tickets for a specific event
    async listByEvent(event_id: string): Promise<Ticket[]> {
        return this.repo.getByEvent(event_id);
    }

    //TODO: Implement listByEvent method to get all tickets for a specific event
    async listByTicketId(ticket_id: string): Promise<Ticket[]> {
        return this.repo.getByTicketId(ticket_id);
    }

    //TODO: Implement getAllTicket method to get all tickets for a specific event
    async getAvailableTicket(): Promise<Ticket[]> {
        return this.repo.getAllAvailTickets();
    }

    //TODO: Implement create method to create a new ticket
    async create(dto: CreateTicketDto): Promise<Ticket> {
        const payload: Partial<Ticket> = {
        event_id: dto.event_id, //foreign key to link ticket to event
        name: dto.name,
        price: dto.price,
        qty_total: dto.qty_total
        };
        return this.repo.create(payload);
    }

    //TODO: Implement create method to create a new ticket
    async edit(dto: EditTicketDto): Promise<Ticket> {
        const payload: Partial<Ticket> = {
        id: dto.id, //ID is required to identify which ticket to edit
        event_id: dto.event_id, //foreign key to link ticket to event
        name: dto.name,
        price: dto.price,
        qty_total: dto.qty_total
        };
        return this.repo.edit(payload);
    }

    //TODO: Implement delete method to delete ticket by ID
    async delete(id: string): Promise<Ticket> {
        const payload: Partial<Ticket> = { id }; //ID is required to identify which ticket to delete
        return this.repo.delete(payload);
    }
}
