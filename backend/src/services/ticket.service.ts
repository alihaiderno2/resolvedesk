import { PrismaClient, Role,SenderType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Setting standard Prisma connection pool
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({connectionString});

// using prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({adapter});

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