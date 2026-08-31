import { Router } from "express";
import { registerController, loginController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema } from "../dto/auth.schema.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerController);
router.post("/login", validateRequest(loginSchema), loginController);

export default router;

