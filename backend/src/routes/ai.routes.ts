import {generateTicketDraftController} from "../controllers/ai.controller";
import {authMiddleware} from "../middlewares/auth.middleware";
import { Router } from "express";
const router = Router();
router.post("/generate-draft/:ticketId",authMiddleware ,generateTicketDraftController);
export default router;