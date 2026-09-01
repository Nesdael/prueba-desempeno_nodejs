import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Users from "../models/users.model.js";
import Roles from "../models/roles.model.js";
import type { LoginInput, RegisterInput } from "../dto/auth.schema.js";


interface AuthResponse {
    token: string;
}

interface RegisteredUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

/**
 * Registra un nuevo usuario con el rol indicado.
 * La contraseña se hashea automáticamente en el hook del modelo.
 */
export const register = async (data: RegisterInput): Promise<RegisteredUser> => {
    const existingUser = await Users.findOne({
        where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
        throw new Error("El email ya está registrado");
    }

    const role = await Roles.findOne({ where: { name: data.role } });

    if (!role) {
        throw new Error(`El rol ${data.role} no existe`);
    }

    const user = await Users.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: role.id,
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role.name,
    };
};

/**
 * Valida las credenciales y devuelve un token JWT.
 */
export const login = async (data: LoginInput): Promise<AuthResponse> => {
    const user = await Users.findOne({
        where: { email: data.email.toLowerCase() },
    });

    if (!user || !user.is_active) {
        throw new Error("Credenciales inválidas");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
        throw new Error("Credenciales inválidas");
    }

    const role = await Roles.findByPk(user.role_id);

    if (!role) {
        throw new Error("Rol no encontrado");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: role.name },
        process.env.JWT_SECRET!,
        { expiresIn: "8h" },
    );

    return { token };
};