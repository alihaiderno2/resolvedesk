import {Request, Response} from 'express';
import {createTicket} from '../services/ticket.service';

export const createTicketController = async (req: Request, res: Response) => {
    try{
        const {subject, customerEmail, customerName, initialMessage} = req.body;
        const organizationId = req.user!.organizationId;

        if(!subject || !customerEmail || !customerName || !initialMessage){
            return res.status(400).json({message: "Missing required fields"});
        }
        console.log("AUDIT - Token Payload:", req.user);
        console.log("AUDIT - Extracted Org ID:", organizationId);
        const result = await createTicket(subject, customerEmail, customerName, initialMessage, organizationId);
        return res.status(201).json({
            message: "Ticket created successfully",
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}