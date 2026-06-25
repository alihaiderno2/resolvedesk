import { Request, Response ,NextFunction} from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
    userId: string;
    role: string;
    organizationId: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }   
    }
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }
        
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret as string) as AuthPayload ;
        if(!decoded){
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    }catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
    }
}