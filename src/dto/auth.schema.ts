import { z } from "zod";

// El rol NO se acepta desde aquí: el registro público siempre crea un
// "manager". Permitir elegirlo dejaría que cualquiera se hiciera admin.
export const registerSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    // Aquí solo se comprueba que venga algo; la validación real la hace bcrypt.
    password: z.string().min(1, "La contraseña es obligatoria"),
});

// z.infer deduce el tipo de TypeScript a partir del schema, así la forma de
// los datos se escribe una sola vez.
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
