import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

// Middleware generico: recibe un schema de zod (uno por recurso, en src/dto)
// y valida req.body antes de que llegue al controller.
export const validateRequest = (schema: ZodType) =>
    (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: 'Datos invalidos',
                errors: result.error.issues.map(issue => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message
                }))
            });
        }

        // req.body se reemplaza por el resultado parseado por zod (con los
        // defaults/coerciones ya aplicados) para que el controller no reciba
        // el body crudo.
        req.body = result.data;

        next();
    };
