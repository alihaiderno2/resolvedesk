import { Router } from "express";
import { registerAdminController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerAdminController);

export default router;