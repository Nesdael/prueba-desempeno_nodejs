import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

// Middleware generico: recibe un schema de zod (los de src/dto) y valida
// req.body antes de que la peticion llegue al controlador.
// Es una funcion que devuelve el middleware ya configurado con ese schema.
export const validateRequest = (schema: ZodType) =>
    (req: Request, res: Response, next: NextFunction) => {

        // safeParse no lanza excepcion: devuelve { success, data } o { success, error }.
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: 'Datos inválidos',
                // Se devuelven TODOS los fallos, no solo el primero, para que
                // el cliente pueda corregirlos de una vez.
                errors: result.error.issues.map(issue => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message
                }))
            });
        }

        next();
    };
