import {Request, Response} from "express";
import {registerAdmin} from "../services/auth.service";
import jwt from "jsonwebtoken";

export const registerAdminController = async (req: Request, res: Response) => {
    try{
        const {name, email, password, role, organizationName} = req.body;

        if(!name || !email || !password || !organizationName){
            return res.status(400).json({message: "Missing required fields"});
        }

        const token = generateToken(name, role, organizationName);
        const result = await registerAdmin(name, email, password, role, organizationName);
        res.status(201).json({
            token: token,
            message: "Admin registered successfully",
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const generateToken = (userId: string, role: string, organizationId : string): string =>  {
    const secret = process.env.JWT_SECRET || "default_secret";
    return jwt.sign({userId, role, organizationId}, secret, {expiresIn: '1h'});
}
