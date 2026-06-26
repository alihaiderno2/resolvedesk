import { createTicketController } from "../controllers/ticket.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.post("/", authMiddleware,createTicketController);