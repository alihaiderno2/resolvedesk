import { Role,SenderType } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function createTicket(subject : string, customerEmail : string, customerName : string, initialMessage : string,organizationId : string): Promise<any> {
    // Checking if the customer exists if not create a new customer. Just got to now it happens this way in Prisma :)
    const customer = await prisma.customer.upsert({
        where:{
            email_organizationId: {
                email: customerEmail,
                organizationId: organizationId,
            }
        },
        update: {},
        create: {
            name: customerName,
            email: customerEmail,
            organizationId: organizationId,
        }
    });
    
    const result = await prisma.$transaction(async (transactionClient) => {
        const newTicket = await transactionClient.ticket.create({
            data: {
                subject: subject,
                customerId: customer.id,
                organizationId: organizationId,
                // status defaults to open
            },
        });
        
        const message = await transactionClient.message.create({
            data: {
                content: initialMessage,
                senderType: SenderType.CUSTOMER,
                ticketId: newTicket.id,
                isInternalNote: false
            }
        });
        return {ticket: newTicket, message: message};
    });
    
    return {
        customer: customer,
        ticket: result.ticket,
        message: result.message
    };
}
export async function getAllTickets(organizationId: string): Promise<any> {
    const tickets = await prisma.ticket.findMany({
        where: {
            organizationId: organizationId,
        },
            include: { 
            customer: true 
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return tickets;
}
export async function getTicketById(ticketId: string, organizationId: string): Promise<any> {
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: ticketId,
            organizationId: organizationId,
        },
        include: {
            customer: true,
            messages: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        },
    });
    
    return ticket;
}