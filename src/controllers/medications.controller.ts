import type { Request, Response } from "express";
import * as medicationsService from "../services/medications.services.js";

// El servicio devuelve null cuando el recurso no existe y lanza Error cuando
// se incumple una regla de negocio. Así el controlador puede responder 404 o
// 400 según el caso, en vez de un código fijo para todo.

// GET /api/medications
export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const medications = await medicationsService.findAll();
        res.status(200).json(medications);
    } catch {
        res.status(500).json({ message: "Error al consultar los medicamentos" });
    }
};

// GET /api/medications/:id
export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        // El `as string` es por noUncheckedIndexedAccess en tsconfig.
        const id = req.params.id as string;
        const medication = await medicationsService.findById(id);

        if (!medication) {
            res.status(404).json({ message: "Medicamento no encontrado" });
            return;
        }

        res.status(200).json(medication);
    } catch {
        res.status(500).json({ message: "Error al consultar el medicamento" });
    }
};

// POST /api/medications  -> solo admin
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const medication = await medicationsService.create(req.body);
        res.status(201).json(medication);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al crear el medicamento";
        res.status(400).json({ message });
    }
};

// PUT /api/medications/:id  -> solo admin
export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const medication = await medicationsService.update(id, req.body);

        if (!medication) {
            res.status(404).json({ message: "Medicamento no encontrado" });
            return;
        }

        res.status(200).json(medication);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar el medicamento";
        res.status(400).json({ message });
    }
};

// DELETE /api/medications/:id  (borrado lógico) -> solo admin
export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await medicationsService.remove(id);

        if (!deleted) {
            res.status(404).json({ message: "Medicamento no encontrado" });
            return;
        }

        res.status(200).json({ message: "Medicamento eliminado" });
    } catch {
        res.status(500).json({ message: "Error al eliminar el medicamento" });
    }
};
