import { Router } from "express";
import * as clinicsController from "../controllers/clinics.controller.js";
import { verifyToken, checkRole } from "../middlewares/verifyToken.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createClinicSchema, updateClinicSchema } from "../dto/clinics.schema.js";


const router = Router();

// lectura: cualquier usuario autenticado. escritura: solo admin.
router.get("/", verifyToken, clinicsController.getAll);

router.get("/:id", verifyToken, clinicsController.getOne);

router.post(
    "/",
    verifyToken,
    checkRole("admin"),
    validateRequest(createClinicSchema),
    clinicsController.create,
);

router.put(
    "/:id",
    verifyToken,
    checkRole("admin"),
    validateRequest(updateClinicSchema),
    clinicsController.update,
);

router.delete("/:id", verifyToken, checkRole("admin"), clinicsController.remove);

export default router;