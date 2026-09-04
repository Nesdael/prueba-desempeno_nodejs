import type { Request, Response } from "express";
import { register, login } from "../services/auth.services.js";

// POST /api/auth/register
export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.body ya viene validado por el middleware validateRequest.
        const user = await register(req.body);
        res.status(201).json(user);
    } catch (error) {
        // 400: email duplicado o falta el rol por defecto en la base.
        const message = error instanceof Error ? error.message : "Error al registrar el usuario";
        res.status(400).json({ message });
    }
};

// POST /api/auth/login
export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await login(req.body);
        // El cliente guarda el token y lo manda en el header Authorization.
        res.status(200).json(result);
    } catch (error) {
        // 401: credenciales incorrectas o usuario inactivo.
        const message = error instanceof Error ? error.message : "Credenciales inválidas";
        res.status(401).json({ message });
    }
};
