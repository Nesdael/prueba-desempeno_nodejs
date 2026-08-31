import { Router } from "express";
import * as requestsController from "../controllers/requests.controller.js";
import { verifyToken, checkRole } from "../middlewares/verifyToken.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createRequestSchema, updateStatusSchema } from "../dto/requests.schema.js";

const router = Router();

router.get("/", verifyToken, requestsController.getActive);

// tiene que ir antes de "/:id" o Express interpreta "clinic" como el id
router.get("/clinic/:clinicId", verifyToken, requestsController.getByClinic);

router.get("/:id", verifyToken, requestsController.getOne);

// a diferencia de clinics/medications/warehouses, aca manager tambien puede
// crear solicitudes y cambiar su estado (aprobar/rechazar), no solo admin
router.post(
    "/",
    verifyToken,
    checkRole("admin", "manager"),
    validateRequest(createRequestSchema),
    requestsController.create,
);

router.patch(
    "/:id/status",
    verifyToken,
    checkRole("admin", "manager"),
    validateRequest(updateStatusSchema),
    requestsController.updateStatus,
);

router.delete("/:id", verifyToken, checkRole("admin"), requestsController.remove);

export default router;