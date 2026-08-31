import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

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

        req.body = result.data;

        next();
    };
