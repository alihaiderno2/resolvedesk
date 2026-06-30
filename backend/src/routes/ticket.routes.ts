import { createTicketController, getAllTicketsController,getTicketByIdController} from "../controllers/ticket.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.post("/", authMiddleware,createTicketController);
router.get("/", authMiddleware,getAllTicketsController);
router.get("/:ticketId", authMiddleware,getTicketByIdController);

export default router;