import type { Request, Response } from "express";
import * as warehousesService from "../services/warehouses.services.js";

// GET /api/warehouses
export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const warehouses = await warehousesService.findAll();
        res.status(200).json(warehouses);
    } catch {
        res.status(500).json({ message: "Error al consultar los almacenes" });
    }
};

// GET /api/warehouses/:id
export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const warehouse = await warehousesService.findById(id);

        if (!warehouse) {
            res.status(404).json({ message: "Almacén no encontrado" });
            return;
        }

        res.status(200).json(warehouse);
    } catch {
        res.status(500).json({ message: "Error al consultar el almacén" });
    }
};

// POST /api/warehouses  -> solo admin
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const warehouse = await warehousesService.create(req.body);
        res.status(201).json(warehouse);
    } catch (error) {
        // Aquí cae "La ciudad indicada no existe".
        const message = error instanceof Error ? error.message : "Error al crear el almacén";
        res.status(400).json({ message });
    }
};

// PUT /api/warehouses/:id  -> solo admin
export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const warehouse = await warehousesService.update(id, req.body);

        if (!warehouse) {
            res.status(404).json({ message: "Almacén no encontrado" });
            return;
        }

        res.status(200).json(warehouse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar el almacén";
        res.status(400).json({ message });
    }
};

// DELETE /api/warehouses/:id  (borrado lógico) -> solo admin
export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await warehousesService.remove(id);

        if (!deleted) {
            res.status(404).json({ message: "Almacén no encontrado" });
            return;
        }

        res.status(200).json({ message: "Almacén eliminado" });
    } catch {
        res.status(500).json({ message: "Error al eliminar el almacén" });
    }
};
