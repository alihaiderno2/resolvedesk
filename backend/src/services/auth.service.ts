import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcrypt";

// Setting standard Prisma connection pool
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({connectionString});

// using prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({adapter});

// To hash a password
function hashPassword(password: string): Promise<string>{
    return bcrypt.hash(password,10);
}
// To compare a password with a hashed password
function comparePassword(password: string, hashedPassword: string) : Promise<boolean>{
    return bcrypt.compare(password, hashedPassword);
}
export async function registerAdmin(name: string, email:string, password: string,role: string,organizationName: string):Promise<any>{
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    
    if(existingUser){
        throw new Error("User with this email already exists");
    }
    const hashedPassword = await hashPassword(password);
    const result = await prisma.$transaction( async (transactionClient) => {
        const newOrganization = await transactionClient.organization.create({
            data: {
                name: organizationName,
            },
        });
        const newUser = await transactionClient.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: hashedPassword,
                role: role as Role,
                organizationId: newOrganization.id,
            },
        });
        return {user: newUser, organization: newOrganization};
        
    });
    return result;
}

