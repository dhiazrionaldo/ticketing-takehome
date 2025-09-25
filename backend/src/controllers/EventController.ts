import { Request, Response } from 'express';
import { EventService } from '../services/EventServices';
import { CreateEventDto } from '../dto/CreateEventDto';
import { EditEventDto } from '../dto/EditEventDto';
import { DeleteEventDto } from '../dto/DeleteEventDto';

export class EventController {
    //Initialize the EventService
    private service = new EventService();

    //TODO: Implement list method to get all events by call the services
    list = async (req: Request, res: Response) => {
        try {
        const events = await this.service.list(); //call service to get all events
        //if successful, return events as JSON response
        res.json(events);
        } catch (err: any) {
        //if error, return 500 status with error message
        res.status(500).json({ message: err.message });
        }
    };

    //TODO: Admin-only Implement create method to create a new event by call the services
    create = async (req: Request, res: Response) => {
        try {
        const dto: CreateEventDto = req.body; //get data from request body that matches CreateEventDto
        const user = (req as any).user; //get authenticated user from request
        const event = await this.service.create(dto, user.id); //call service to create event
        
        //if successful, return 200 status with created event data
        res.status(200).json(event);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };

    //TODO: Admin-only Implement edit method to edit the existing event by call the services
    edit = async (req: Request, res: Response) => {
        try {
        const dto: EditEventDto = req.body; //get data from request body that matches EditEventDto
        const user = (req as any).user; //get authenticated user from request
        const event = await this.service.edit(dto.id!, dto, user.id); //call service to edit event
        
        //if successful, return 200 status with edited event data
        res.status(200).json(event);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };

    //TODO: Admin-only Implement edit method to edit the existing event by call the services
    delete = async (req: Request, res: Response) => {
        try {
        const dto: DeleteEventDto = req.body; //get data from request body that matches DeleteEventDto
        const user = (req as any).user;//get authenticated user from request
        //call service to delete event
        //Note: we are not using 'user' for now, but in real world scenario, we should check if the user has permission to delete the event
        const event = await this.service.delete(dto.id!);//call service to delete event
        
        //if successful, return 200 status with deleted event data
        res.status(200).json(event);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };
}
