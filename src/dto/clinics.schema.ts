import { z } from "zod";

export const createClinicSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    nit: z.string().min(5, "El NIT es obligatorio"),
    address: z.string().min(5, "La dirección es obligatoria"),
    city_id: z.string().uuid("El id de la ciudad debe ser un UUID válido"),
    manager_id: z.string().uuid("El id del responsable debe ser un UUID válido"),
});

export const updateClinicSchema = createClinicSchema.partial();

export type CreateClinicInput = z.infer<typeof createClinicSchema>;
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>;