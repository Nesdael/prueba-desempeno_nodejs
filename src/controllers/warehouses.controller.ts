import type { Request, Response } from "express";
import * as warehousesService from "../services/warehouses.services.js";

export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const warehouses = await warehousesService.findAll();
        res.status(200).json(warehouses);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(500).json({ message });
    }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        const warehouse = await warehousesService.findById(id);
        res.status(200).json(warehouse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(404).json({ message });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const warehouse = await warehousesService.create(req.body);
        res.status(201).json(warehouse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al crear";
        res.status(400).json({ message });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        const warehouse = await warehousesService.update(id, req.body);
        res.status(200).json(warehouse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar";
        res.status(400).json({ message });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        await warehousesService.remove(id);
        res.status(200).json({ message: "Almacén eliminado" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar";
        res.status(404).json({ message });
    }
};