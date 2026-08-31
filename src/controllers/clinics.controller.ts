import type { Request, Response } from "express";
import * as clinicsService from "../services/clinics.services.js";

// getOne/update/remove usan findById, que tira Error si no existe -> 404.
// create/update en 400 porque ahi suelen fallar las validaciones de negocio
// (NIT duplicado, ciudad/manager inexistente).

export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const clinics = await clinicsService.findAll();
        res.status(200).json(clinics);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(500).json({ message });
    }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        const clinic = await clinicsService.findById(id);
        res.status(200).json(clinic);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(404).json({ message });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const clinic = await clinicsService.create(req.body);
        res.status(201).json(clinic);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al crear";
        res.status(400).json({ message });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        const clinic = await clinicsService.update(id, req.body);
        res.status(200).json(clinic);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar";
        res.status(400).json({ message });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        await clinicsService.remove(id);
        res.status(200).json({ message: "Clínica eliminada" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar";
        res.status(404).json({ message });
    }
};