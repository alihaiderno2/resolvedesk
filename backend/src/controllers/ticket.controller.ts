import {Request, Response} from 'express';
import {createTicket,getAllTickets,getTicketById} from '../services/ticket.service';

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
export const getAllTicketsController = async (req: Request, res: Response) => {
    try{
        const organizationId = req.user!.organizationId;
        const tickets = await getAllTickets(organizationId);
        return res.status(200).json({
            message: "Tickets fetched successfully",
            data: tickets,
        });
    }catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
export const getTicketByIdController = async (req: Request, res: Response) => {
    try{
        const ticketId = req.params.ticketId as string;
        const organizationId = req.user!.organizationId;
        
        const result = await getTicketById(ticketId, organizationId);
        if(!result){
            return res.status(404).json({message: "Ticket not found"});
        }
        return res.status(200).json({
            message: "Ticket fetched successfully",
            data: result,
        });
    }catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}