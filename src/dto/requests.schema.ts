import { z } from "zod";

export const createRequestSchema = z.object({
    clinic_id: z.string().uuid("El id de la clínica debe ser un UUID válido"),
    medication_id: z.string().uuid("El id del medicamento debe ser un UUID válido"),
    warehouse_id: z.string().uuid("El id del almacén debe ser un UUID válido"),
    quantity: z.number().int("La cantidad debe ser un número entero").positive("La cantidad debe ser mayor a cero"),
});

// endpoint aparte solo para cambiar el estado (PATCH /:id/status), no comparte
// schema con el update de otros recursos porque aca no se editan los demas campos
export const updateStatusSchema = z.object({
    status: z.enum(["pendiente", "aprobada", "rechazada", "entregada"], {
        message: "El estado no es válido",
    }),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;