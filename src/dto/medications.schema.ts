import { z } from "zod";

export const createMedicationSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    presentation: z.string().min(3, "La presentación es obligatoria"),
});

// partial() vuelve opcionales todos los campos, para permitir updates parciales.
export const updateMedicationSchema = createMedicationSchema.partial();

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;
