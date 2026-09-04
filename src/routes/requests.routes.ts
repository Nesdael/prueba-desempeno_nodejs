import { Router } from "express";
import * as requestsController from "../controllers/requests.controller.js";
import { verifyToken, checkRole } from "../middlewares/verifyToken.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createRequestSchema, updateStatusSchema } from "../dto/requests.schema.js";

const router = Router();

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Lista las solicitudes activas
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de solicitudes activas, de la más reciente a la más antigua
 *       401:
 *         description: No autenticado
 */
router.get("/", verifyToken, requestsController.getActive);

/**
 * @swagger
 * /api/requests/clinic/{clinicId}:
 *   get:
 *     summary: Consulta el historial completo de solicitudes de una clínica
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Historial de solicitudes de la clínica
 *       404:
 *         description: La clínica indicada no existe
 */
// tiene que ir antes de "/:id" o Express interpreta "clinic" como el id
router.get("/clinic/:clinicId", verifyToken, requestsController.getByClinic);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Consulta una solicitud por id
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *       404:
 *         description: Solicitud no encontrada
 */
router.get("/:id", verifyToken, requestsController.getOne);

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Crea una solicitud de abastecimiento (admin o manager)
 *     description: Valida existencia de clínica, medicamento y almacén, y descuenta el stock del inventario si hay suficiente.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequest'
 *     responses:
 *       201:
 *         description: Solicitud creada
 *       400:
 *         description: Clínica/medicamento/almacén inexistente o inventario insuficiente
 *       403:
 *         description: Rol sin permiso
 */
// a diferencia de clinics/medications/warehouses, aca manager tambien puede
// crear solicitudes y cambiar su estado (aprobar/rechazar), no solo admin
router.post(
    "/",
    verifyToken,
    checkRole("admin", "manager"),
    validateRequest(createRequestSchema),
    requestsController.create,
);

/**
 * @swagger
 * /api/requests/{id}/status:
 *   patch:
 *     summary: Actualiza el estado de una solicitud (admin o manager)
 *     description: Si se rechaza, devuelve la cantidad al inventario del almacén. No se puede modificar una solicitud ya entregada o rechazada.
 *     tags:
 *       - Requests
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
 *             $ref: '#/components/schemas/UpdateRequestStatus'
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Estado no válido o solicitud ya finalizada
 *       404:
 *         description: Solicitud no encontrada
 *       403:
 *         description: Rol sin permiso
 */
router.patch(
    "/:id/status",
    verifyToken,
    checkRole("admin", "manager"),
    validateRequest(updateStatusSchema),
    requestsController.updateStatus,
);

/**
 * @swagger
 * /api/requests/{id}:
 *   delete:
 *     summary: Elimina lógicamente una solicitud (solo admin)
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Solicitud eliminada
 *       404:
 *         description: Solicitud no encontrada
 *       403:
 *         description: Rol sin permiso
 */
router.delete("/:id", verifyToken, checkRole("admin"), requestsController.remove);

export default router;