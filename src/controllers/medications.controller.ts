
import type { Request, Response } from "express";
import * as medicationsService from "../services/medications.services.js";

export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const medications = await medicationsService.findAll();
        res.status(200).json(medications);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(500).json({ message });
    }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        const medication = await medicationsService.findById(id);
        res.status(200).json(medication);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(404).json({ message });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const medication = await medicationsService.create(req.body);
        res.status(201).json(medication);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al crear";
        res.status(400).json({ message });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        const medication = await medicationsService.update(id, req.body);
        res.status(200).json(medication);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar";
        res.status(400).json({ message });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        await medicationsService.remove(id);
        res.status(200).json({ message: "Medicamento eliminado" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar";
        res.status(404).json({ message });
    }
};