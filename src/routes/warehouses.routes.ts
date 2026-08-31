import { Router } from "express";
import * as warehousesController from "../controllers/warehouses.controller.js";
import { verifyToken, checkRole } from "../middlewares/verifyToken.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createWarehouseSchema, updateWarehouseSchema } from "../dto/warehouses.schema.js";


const router = Router();

// lectura: cualquier usuario autenticado. escritura: solo admin.
router.get("/", verifyToken, warehousesController.getAll);

router.get("/:id", verifyToken, warehousesController.getOne);

router.post(
    "/",
    verifyToken,
    checkRole("admin"),
    validateRequest(createWarehouseSchema),
    warehousesController.create,
);

router.put(
    "/:id",
    verifyToken,
    checkRole("admin"),
    validateRequest(updateWarehouseSchema),
    warehousesController.update,
);

router.delete("/:id", verifyToken, checkRole("admin"), warehousesController.remove);

export default router;