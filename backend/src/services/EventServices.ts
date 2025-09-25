import { EventRepo } from '../repos/EventRepo';
import { CreateEventDto } from '../dto/CreateEventDto';
import { Event } from '../models/Events';
import { EditEventDto } from '../dto/EditEventDto';

export class EventService {
  private repo = new EventRepo();
  
  //TODO: Implement list method to get all events
  async list(): Promise<Event[]> {
    return this.repo.getAll();
  }

  //TODO: Set payload fields properly for creating an event
  async create(dto: CreateEventDto, created_by: string): Promise<Event> {
    const payload: Partial<Event> = {
      title: dto.title,
      description: dto.description ?? null, //optional fields set to null if not provided
      venue: dto.venue ?? null, //optional fields set to null if not provided
      start_time: dto.start_time ?? null, //optional fields set to null if not provided
      end_time: dto.end_time ?? null, //optional fields set to null if not provided
      capacity: dto.capacity ?? 0,
      created_by
    };
    return this.repo.create(payload);
  }

  //TODO: Set payload fields properly for edit event by ID
  async edit(id: string, dto: EditEventDto, created_by: string): Promise<Event> {
    const payload: Partial<Event> = {
      id, //ID is required to identify which event to edit
      title: dto.title,
      description: dto.description ?? null, //optional fields set to null if not provided
      venue: dto.venue ?? null, //optional fields set to null if not provided
      start_time: dto.start_time ?? null, //optional fields set to null if not provided
      end_time: dto.end_time ?? null, //optional fields set to null if not provided
      capacity: dto.capacity ?? 0,
      created_by
    };
    return this.repo.edit(payload);
  }

  //TODO: Implement delete method to delete event by ID
  async delete(id: string): Promise<Event> {
    const payload: Partial<Event> = { id }; //ID is required to identify which event to delete
    return this.repo.delete(payload);
  }
}
