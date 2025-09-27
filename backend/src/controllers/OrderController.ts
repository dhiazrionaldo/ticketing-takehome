import { Request, Response } from 'express';
import { OrderService } from '../services/OrderServices';
import { CreateOrderDto } from '../dto/CreateOrderDto';

export class OrderController {
    //Initialize the OrderService
    private service = new OrderService();

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
