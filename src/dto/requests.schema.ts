import { z } from "zod";

// No incluye user_id: ese dato lo saca el controlador del token, no del body.
export const createRequestSchema = z.object({
    clinic_id: z.string().uuid("El id de la clínica debe ser un UUID válido"),
    medication_id: z.string().uuid("El id del medicamento debe ser un UUID válido"),
    warehouse_id: z.string().uuid("El id del almacén debe ser un UUID válido"),
    quantity: z.number().int("La cantidad debe ser un número entero").positive("La cantidad debe ser mayor a cero"),
});

// Schema aparte para PATCH /:id/status, donde solo se cambia el estado.
export const updateStatusSchema = z.object({
    status: z.enum(["pendiente", "aprobada", "rechazada", "entregada"], {
        message: "El estado no es válido",
    }),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
