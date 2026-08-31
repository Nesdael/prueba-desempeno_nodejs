
import type { Request, Response } from "express";
import * as requestsService from "../services/requests.services.js";

// mismo patron de status codes que clinics/medications/warehouses
// (404 no encontrado, 400 regla de negocio, 500 error inesperado)
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.user lo llena verifyToken; queda registrado quien pidio el medicamento
        const userId = (req as any).user.id;
        const request = await requestsService.create(req.body, userId);
        res.status(201).json(request);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al crear la solicitud";
        res.status(400).json({ message });
    }
};

export const getActive = async (req: Request, res: Response): Promise<void> => {
    try {
        const requests = await requestsService.findActive();
        res.status(200).json(requests);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(500).json({ message });
    }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        const request = await requestsService.findById(id);
        res.status(200).json(request);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(404).json({ message });
    }
};

export const getByClinic = async (req: Request, res: Response): Promise<void> => {
    try {
        const clinicId = req.params.id as string
        const requests = await requestsService.findByClinic(clinicId);
        res.status(200).json(requests);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al consultar";
        res.status(404).json({ message });
    }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        const request = await requestsService.updateStatus(id, req.body.status);
        res.status(200).json(request);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar";
        res.status(400).json({ message });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string
        await requestsService.remove(id);
        res.status(200).json({ message: "Solicitud eliminada" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar";
        res.status(404).json({ message });
    }
};