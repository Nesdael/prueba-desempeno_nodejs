import { Router } from "express";
import * as medicationsController from "../controllers/medications.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { checkRole } from "../middlewares/verifyToken.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createMedicationSchema, updateMedicationSchema } from "../dto/medications.schema.js";

const router = Router();

/**
 * @swagger
 * /api/medications:
 *   get:
 *     summary: Lista los medicamentos activos
 *     tags:
 *       - Medications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de medicamentos
 *       401:
 *         description: No autenticado
 */
// lectura: cualquier usuario autenticado. escritura: solo admin.
router.get("/", verifyToken, medicationsController.getAll);

/**
 * @swagger
 * /api/medications/{id}:
 *   get:
 *     summary: Consulta un medicamento por id
 *     tags:
 *       - Medications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Medicamento encontrado
 *       404:
 *         description: Medicamento no encontrado
 */
router.get("/:id", verifyToken, medicationsController.getOne);

/**
 * @swagger
 * /api/medications:
 *   post:
 *     summary: Crea un medicamento (solo admin)
 *     tags:
 *       - Medications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medication'
 *     responses:
 *       201:
 *         description: Medicamento creado
 *       400:
 *         description: Ya existe un medicamento con ese nombre y presentación
 *       403:
 *         description: Rol sin permiso
 */
router.post("/", verifyToken, checkRole("admin"), validateRequest(createMedicationSchema), medicationsController.create);

/**
 * @swagger
 * /api/medications/{id}:
 *   put:
 *     summary: Actualiza un medicamento (solo admin)
 *     tags:
 *       - Medications
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
 *             $ref: '#/components/schemas/Medication'
 *     responses:
 *       200:
 *         description: Medicamento actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Medicamento no encontrado
 *       403:
 *         description: Rol sin permiso
 */
router.put("/:id", verifyToken, checkRole("admin"), validateRequest(updateMedicationSchema), medicationsController.update);

/**
 * @swagger
 * /api/medications/{id}:
 *   delete:
 *     summary: Elimina lógicamente un medicamento (solo admin)
 *     tags:
 *       - Medications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Medicamento eliminado
 *       404:
 *         description: Medicamento no encontrado
 *       403:
 *         description: Rol sin permiso
 */
router.delete("/:id", verifyToken, checkRole("admin"), medicationsController.remove);

export default router;