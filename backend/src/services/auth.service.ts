import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import bcrypt from "bcrypt";

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
        throw new Error("Invalid credentials");
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
export async function loginUser(email: string, password: string): Promise<any> {
    const user = await prisma.user.findUnique({
        where:{
            email: email,
        }
    })
    if(!user){
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if(!isPasswordValid){
        throw new Error("Invalid credentials");
    }

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser };
}
