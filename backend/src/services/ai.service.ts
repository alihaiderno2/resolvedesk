import { configDotenv } from "dotenv";
import {prisma} from "../lib/prisma";
import {SenderType } from "@prisma/client";
import {GoogleGenerativeAI} from "@google/generative-ai";
configDotenv(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateTicketDraft(ticketId: string, organizationId:string): Promise<any> {
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: ticketId,
            organizationId: organizationId,
        },
        include: {
            customer: true,
            organization: true,
            messages: {
                orderBy: {
                    createdAt: 'asc',
                },
            }
    }
    })
    if(!ticket){
        throw new Error("Ticket not found");
    }
    const customerName = ticket.customer.name || "Customer";
    const orgName = ticket.organization.name;

    // The conversation history of the customer
    const conversationHistory = ticket.messages.map(msg => 
        `${msg.senderType}: ${msg.content}`
    ).join('\n');

    // The system prompt for the AI model
    const systemPrompt = `
        You are a helpful, professional customer support agent working for ${orgName}.
        Read the following conversation history with ${customerName}.
        Write a polite, empathetic, and helpful response to resolve their issue.
        Do not include placeholders like [Your Name]. Just write the message itself.
        
        Conversation History:
        ${conversationHistory}
    `;

    // Calling Gemini
    const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});
    const response = await model.generateContent(systemPrompt);
    const aiResponseText = response.response.text();

    const aiMessage = await prisma.message.create({
        data: {
            content: aiResponseText,
            senderType: SenderType.AI,
            ticketId: ticket.id,
            isInternalNote: true //Letting agent review it first
        }
    });

    return aiMessage;
}