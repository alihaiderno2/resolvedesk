import {Request, Response} from "express";
import {registerAdmin,loginUser} from "../services/auth.service";
import jwt from "jsonwebtoken";

export const registerAdminController = async (req: Request, res: Response) => {
    try{
        const {name, email, password, role, organizationName} = req.body;

        if(!name || !email || !password || !organizationName){
            return res.status(400).json({message: "Missing required fields"});
        }

        const result = await registerAdmin(name, email, password, role, organizationName);
        const token = generateToken(name, role, result.organization.id);
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
export const loginUserController = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Missing required fields"});
        }

        const result = await loginUser(email, password);
        const token = generateToken(result.user.id, result.user.role, result.user.organizationId);
        return res.status(200).json({
            token: token,
            message: "User logged in successfully",
            data: result,
        });
    }catch (error) {
        if (error instanceof Error && error.message === "Invalid credentials") {
            return res.status(401).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const generateToken = (userId: string, role: string, organizationId : string): string =>  {
    const secret = process.env.JWT_SECRET || "default_secret";
    return jwt.sign({userId, role, organizationId}, secret, {expiresIn: '1h'});
}
