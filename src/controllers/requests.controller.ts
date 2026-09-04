import type { Request, Response } from "express";
import * as requestsService from "../services/requests.services.js";

// POST /api/requests  -> admin o manager
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.user lo rellena verifyToken. El id del solicitante se toma del
        // token y no del body, para que nadie pueda crear solicitudes a nombre
        // de otro usuario.
        const userId = req.user!.id;
        const request = await requestsService.create(req.body, userId);
        res.status(201).json(request);
    } catch (error) {
        // Aquí caen "Inventario insuficiente", "El almacén no maneja ese
        // medicamento", etc. Todas son reglas de negocio.
        const message = error instanceof Error ? error.message : "Error al crear la solicitud";
        res.status(400).json({ message });
    }
};

// GET /api/requests  -> activas, más recientes primero
export const getActive = async (req: Request, res: Response): Promise<void> => {
    try {
        const requests = await requestsService.findActive();
        res.status(200).json(requests);
    } catch {
        res.status(500).json({ message: "Error al consultar las solicitudes" });
    }
};

// GET /api/requests/:id
export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const request = await requestsService.findById(id);

        if (!request) {
            res.status(404).json({ message: "Solicitud no encontrada" });
            return;
        }

        res.status(200).json(request);
    } catch {
        res.status(500).json({ message: "Error al consultar la solicitud" });
    }
};

// GET /api/requests/clinic/:clinicId  -> historial completo de una clínica
export const getByClinic = async (req: Request, res: Response): Promise<void> => {
    try {
        // El parámetro se llama clinicId, igual que en la declaración de la ruta.
        const clinicId = req.params.clinicId as string;
        const requests = await requestsService.findByClinic(clinicId);

        if (!requests) {
            res.status(404).json({ message: "La clínica indicada no existe" });
            return;
        }

        res.status(200).json(requests);
    } catch {
        res.status(500).json({ message: "Error al consultar el historial de la clínica" });
    }
};

// PATCH /api/requests/:id/status  -> admin o manager
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const request = await requestsService.updateStatus(id, req.body.status);

        if (!request) {
            res.status(404).json({ message: "Solicitud no encontrada" });
            return;
        }

        res.status(200).json(request);
    } catch (error) {
        // Aquí cae "No se puede modificar una solicitud entregada/rechazada".
        const message = error instanceof Error ? error.message : "Error al actualizar el estado de la solicitud";
        res.status(400).json({ message });
    }
};

// DELETE /api/requests/:id  (borrado lógico) -> solo admin
export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await requestsService.remove(id);

        if (!deleted) {
            res.status(404).json({ message: "Solicitud no encontrada" });
            return;
        }

        res.status(200).json({ message: "Solicitud eliminada" });
    } catch {
        res.status(500).json({ message: "Error al eliminar la solicitud" });
    }
};
