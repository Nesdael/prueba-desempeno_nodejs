import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Forma del payload que se firma en auth.services.ts al hacer login.
export interface AuthPayload {
    id: string;
    email: string;
    role: string;
}

// Se anade `user` a la interfaz Request de Express para poder escribir req.user.
// Es opcional porque en las rutas publicas nadie la rellena.
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

// AUTENTICACION: valida el header "Authorization: Bearer <token>" y deja el
// payload decodificado en req.user.
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = header.split(" ")[1];

    // Cubre el caso "Authorization: Bearer " (con prefijo pero sin token).
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
        // verify() comprueba la firma y la expiracion; si algo falla, lanza.
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

// AUTORIZACION: debe ir siempre despues de verifyToken, que es quien llena
// req.user. Uso: checkRole("admin") o checkRole("admin", "manager").
export const checkRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !roles.includes(user.role)) {
            // 403 = se quien eres, pero no puedes. Distinto del 401.
            return res.status(403).json({ message: "No tienes permiso para acceder" });
        }

        next();
    };
};
