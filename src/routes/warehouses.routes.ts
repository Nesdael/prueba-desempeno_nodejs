import { Router } from "express";
import * as warehousesController from "../controllers/warehouses.controller.js";
import { verifyToken, checkRole } from "../middlewares/verifyToken.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createWarehouseSchema, updateWarehouseSchema } from "../dto/warehouses.schema.js";


const router = Router();

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: Lista los almacenes activos
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de almacenes
 *       401:
 *         description: No autenticado
 */
// lectura: cualquier usuario autenticado. escritura: solo admin.
router.get("/", verifyToken, warehousesController.getAll);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   get:
 *     summary: Consulta un almacén por id
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Almacén encontrado
 *       404:
 *         description: Almacén no encontrado
 */
router.get("/:id", verifyToken, warehousesController.getOne);

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     summary: Crea un almacén (solo admin)
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       201:
 *         description: Almacén creado
 *       400:
 *         description: La ciudad indicada no existe
 *       403:
 *         description: Rol sin permiso
 */
router.post(
    "/",
    verifyToken,
    checkRole("admin"),
    validateRequest(createWarehouseSchema),
    warehousesController.create,
);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   put:
 *     summary: Actualiza un almacén (solo admin)
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       200:
 *         description: Almacén actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Almacen no encontrado
 *       403:
 *         description: Rol sin permiso
 */
router.put(
    "/:id",
    verifyToken,
    checkRole("admin"),
    validateRequest(updateWarehouseSchema),
    warehousesController.update,
);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     summary: Elimina lógicamente un almacén (solo admin)
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Almacén eliminado
 *       404:
 *         description: Almacén no encontrado
 *       403:
 *         description: Rol sin permiso
 */
router.delete("/:id", verifyToken, checkRole("admin"), warehousesController.remove);

export default router;