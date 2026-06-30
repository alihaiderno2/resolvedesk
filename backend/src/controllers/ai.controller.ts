import { generateTicketDraft } from "../services/ai.service";
import { Request, Response } from "express";
export const generateTicketDraftController = async (req: Request, res: Response) => {
    try{
        const ticketId = req.params.ticketId as string;
        const organizationId = req.user!.organizationId;
        const result = await generateTicketDraft(ticketId, organizationId);
        return res.status(200).json({
            message: "AI draft generated successfully",
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