import { Router } from "express";
import * as clinicsController from "../controllers/clinics.controller.js";
import { verifyToken, checkRole } from "../middlewares/verifyToken.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createClinicSchema, updateClinicSchema } from "../dto/clinics.schema.js";


const router = Router();

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     summary: Lista las clínicas activas
 *     tags:
 *       - Clinics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de clínicas
 *       401:
 *         description: No autenticado
 */
// lectura: cualquier usuario autenticado. escritura: solo admin.
router.get("/", verifyToken, clinicsController.getAll);

/**
 * @swagger
 * /api/clinics/{id}:
 *   get:
 *     summary: Consulta una clínica por id
 *     tags:
 *       - Clinics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Clínica encontrada
 *       404:
 *         description: Clínica no encontrada
 */
router.get("/:id", verifyToken, clinicsController.getOne);

/**
 * @swagger
 * /api/clinics:
 *   post:
 *     summary: Registra una clínica (solo admin)
 *     tags:
 *       - Clinics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clinic'
 *     responses:
 *       201:
 *         description: Clínica creada
 *       400:
 *         description: NIT duplicado, ciudad o responsable inexistente
 *       403:
 *         description: Rol sin permiso
 */
router.post(
    "/",
    verifyToken,
    checkRole("admin"),
    validateRequest(createClinicSchema),
    clinicsController.create,
);

/**
 * @swagger
 * /api/clinics/{id}:
 *   put:
 *     summary: Actualiza una clínica (solo admin)
 *     tags:
 *       - Clinics
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
 *             $ref: '#/components/schemas/Clinic'
 *     responses:
 *       200:
 *         description: Clínica actualizada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Clinica no encontrada
 *       403:
 *         description: Rol sin permiso
 */
router.put(
    "/:id",
    verifyToken,
    checkRole("admin"),
    validateRequest(updateClinicSchema),
    clinicsController.update,
);

/**
 * @swagger
 * /api/clinics/{id}:
 *   delete:
 *     summary: Elimina lógicamente una clínica (solo admin)
 *     tags:
 *       - Clinics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Clínica eliminada
 *       404:
 *         description: Clínica no encontrada
 *       403:
 *         description: Rol sin permiso
 */
router.delete("/:id", verifyToken, checkRole("admin"), clinicsController.remove);

export default router;