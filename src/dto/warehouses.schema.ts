import { z } from "zod";

export const createWarehouseSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    address: z.string().min(5, "La dirección es obligatoria"),
    city_id: z.string().uuid("El id de la ciudad debe ser un UUID válido"),
});

export const updateWarehouseSchema = createWarehouseSchema.partial();

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;
