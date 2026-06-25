import { Router } from "express";
import { registerAdminController,loginUserController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerAdminController);
router.post("/login", loginUserController);

export default router;