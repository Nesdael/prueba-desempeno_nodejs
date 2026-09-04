import type { Request, Response } from "express";
import * as clinicsService from "../services/clinics.services.js";

// GET /api/clinics
export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const clinics = await clinicsService.findAll();
        res.status(200).json(clinics);
    } catch {
        res.status(500).json({ message: "Error al consultar las clínicas" });
    }
};

// GET /api/clinics/:id
export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const clinic = await clinicsService.findById(id);

        if (!clinic) {
            res.status(404).json({ message: "Clínica no encontrada" });
            return;
        }

        res.status(200).json(clinic);
    } catch {
        res.status(500).json({ message: "Error al consultar la clínica" });
    }
};

// POST /api/clinics  -> solo admin
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const clinic = await clinicsService.create(req.body);
        res.status(201).json(clinic);
    } catch (error) {
        // Aquí caen NIT duplicado, ciudad inexistente y responsable inexistente.
        const message = error instanceof Error ? error.message : "Error al crear la clínica";
        res.status(400).json({ message });
    }
};

// PUT /api/clinics/:id  -> solo admin
export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const clinic = await clinicsService.update(id, req.body);

        if (!clinic) {
            res.status(404).json({ message: "Clínica no encontrada" });
            return;
        }

        res.status(200).json(clinic);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar la clínica";
        res.status(400).json({ message });
    }
};

// DELETE /api/clinics/:id  (borrado lógico) -> solo admin
export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await clinicsService.remove(id);

        if (!deleted) {
            res.status(404).json({ message: "Clínica no encontrada" });
            return;
        }

        res.status(200).json({ message: "Clínica eliminada" });
    } catch {
        res.status(500).json({ message: "Error al eliminar la clínica" });
    }
};
