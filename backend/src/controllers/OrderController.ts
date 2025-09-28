import { Request, Response } from 'express';
import { OrderService } from '../services/OrderServices';
import { CreateOrderDto } from '../dto/CreateOrderDto';

export class OrderController {
    //Initialize the OrderService
    private service = new OrderService();

    //TODO: Implement listByTicket method to get all tickets for an event by call the services
    listByTicket = async (req: Request, res: Response) => {
        try {
        const ticket_id = req.params.ticketId; //get event ID from request parameters
        //call service to get all tickets for the event
        const tickets = await this.service.listByTicket(ticket_id);
        //if successful, return tickets as JSON response
        res.json(tickets);
        } catch (err: any) {
        //if error, return 500 status with error message
            res.status(500).json({ message: err.message });
        }
    };

    //TODO: Implement purchase method to create a new order by call the services
    purchase = async (req: Request, res: Response) => {
        try {
        const dto: CreateOrderDto = req.body; //get data from request body
        const user = (req as any).user; //get authenticated user from request
        
        //call service to create order
        const order = await this.service.purchase(user.id, dto);
        //if successful, return 200 status with created order data
        res.status(200).json(order);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };
}
