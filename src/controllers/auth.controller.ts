import type { Request, Response } from "express";
import { register, login } from "../services/auth.services.js";

export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await register(req.body);
        res.status(201).json(user);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al registrar";
        res.status(400).json({ message });
    }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await login(req.body);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al iniciar sesión";
        res.status(401).json({ message });
    }
};