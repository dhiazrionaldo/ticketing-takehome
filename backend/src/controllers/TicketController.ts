import { Request, Response } from 'express';
import { TicketService } from '../services/TicketServices';
import { CreateTicketDto } from '../dto/CreateTicketDto';
import { EditTicketDto } from '../dto/EditTicketDto';
import { DeleteTicketDto } from '../dto/DeleteTicketDto';

export class TicketController {
    //Initialize the TicketService
    private service = new TicketService();
    
    //TODO: Implement listByEvent method to get all tickets for an event by call the services
    listByEvent = async (req: Request, res: Response) => {
        try {
        const event_id = req.params.eventId; //get event ID from request parameters
        //call service to get all tickets for the event
        const tickets = await this.service.listByEvent(event_id);
        //if successful, return tickets as JSON response
        res.json(tickets);
        } catch (err: any) {
        //if error, return 500 status with error message
            res.status(500).json({ message: err.message });
        }
    };

    //TODO: Admin-only Implement create method to create a new ticket by call the services
    create = async (req: Request, res: Response) => {
        try {
        const dto: CreateTicketDto = req.body; //get data from request body
        const ticket = await this.service.create(dto);//call service to create ticket
        
        //if successful, return 200 status with created ticket data
        res.status(200).json(ticket);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };

    //TODO: Admin-only Implement edit method to edit an existing ticket by call the services
    edit = async (req: Request, res: Response) => {
        try {
        const dto: EditTicketDto = req.body; //get data from request body
        const ticket = await this.service.edit(dto);//call service to create ticket
        
        //if successful, return 200 status with edited ticket data
        res.status(200).json(ticket);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };

    //TODO: Admin-only Implement delete method to delete ticket by call the services
    delete = async (req: Request, res: Response) => {
        try {
        const dto: DeleteTicketDto = req.body; //get data from request body
        const ticket = await this.service.delete(dto.id);//call service to create ticket
        
        //if successful, return 200 status with edited ticket data
        res.status(200).json(ticket);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };
}
