import { Router } from "express";
import { registerController, loginController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema } from "../dto/auth.schema.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar usuario
 *     description: Endpoint sin restriccion, el mismo usuario elige el rol con el que se registra.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 665f1a2b-11a1-4b2c-9c3d-4e5f6a7b8c9d
 *                 name:
 *                   type: string
 *                   example: Nestor Duran
 *                 email:
 *                   type: string
 *                   example: admin@medicare.com
 *                 role:
 *                   type: string
 *                   example: admin
 *       400:
 *         description: Datos invalidos o email ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El email ya esta registrado
 */
router.post("/register", validateRequest(registerSchema), registerController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesion
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Token generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWYxYTJiIn0.abc123
 *       401:
 *         description: Credenciales invalidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales invalidas
 */
router.post("/login", validateRequest(loginSchema), loginController);

export default router;

