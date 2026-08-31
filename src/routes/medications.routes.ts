import { Router } from "express";
import * as medicationsController from "../controllers/medications.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { checkRole } from "../middlewares/verifyToken.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createMedicationSchema, updateMedicationSchema } from "../dto/medications.schema.js";

const router = Router();

// lectura: cualquier usuario autenticado. escritura: solo admin.
router.get("/", verifyToken, medicationsController.getAll);
router.get("/:id", verifyToken, medicationsController.getOne);
router.post("/", verifyToken, checkRole("admin"), validateRequest(createMedicationSchema), medicationsController.create);
router.put("/:id", verifyToken, checkRole("admin"), validateRequest(updateMedicationSchema), medicationsController.update);
router.delete("/:id", verifyToken, checkRole("admin"), medicationsController.remove);

export default router;