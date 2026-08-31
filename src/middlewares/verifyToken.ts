import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Valida el header "Authorization: Bearer <token>" y deja el payload
// decodificado en req.user para que checkRole y los controllers lo usen.
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if(!header || !header?.startsWith("Bearer ")){
        return res.status(401).json({message: 'Token no proporcionado'})
    }

    const token = header.split(" ")[1]

    if(!token){
        return res.status(401).json({message: 'token no proporcionado'})
    }

    try{

        const secretKey = process.env.JWT_SECRET

        const payload = jwt.verify(token,secretKey!);

        (req as any).user = payload;

        next()

    } catch {
        return res.status(401).json({message: 'Token invalido o expirado'})
    }
} 

// Debe ir siempre despues de verifyToken, es el que llena req.user.
// Uso: checkRole("admin") o checkRole("admin", "manager").
export const checkRole= (...Roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if(!user || !Roles.includes( user.role)) {

            return res.status(403).json({message: 'No tienes permiso para acceder'})
        }
        next()
    }
}
