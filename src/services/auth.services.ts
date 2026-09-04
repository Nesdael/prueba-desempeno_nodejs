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
    role: string;   // se devuelve el nombre del rol, no el role_id
}

// Rol que se asigna en el registro público. Los admin se crean con los seeders
// o desde la base; no se pueden pedir desde fuera.
const DEFAULT_ROLE = "manager";

/** Registra un usuario nuevo con rol manager. */
export const register = async (data: RegisterInput): Promise<RegisteredUser> => {
    const existingUser = await Users.findOne({
        where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
        throw new Error("El email ya está registrado");
    }

    // La tabla Users guarda role_id (UUID), así que hay que traducir el nombre.
    const role = await Roles.findOne({ where: { name: DEFAULT_ROLE } });

    if (!role) {
        // Solo pasa si no se han corrido los seeders y la tabla Roles está vacía.
        throw new Error("No se pudo asignar el rol por defecto. Ejecuta los seeders");
    }

    // La contraseña se pasa en claro: el hook beforeCreate del modelo la hashea.
    const user = await Users.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: role.id,
    });

    // Se arma la respuesta a mano para que el hash nunca salga en el JSON.
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role.name,
    };
};

/** Valida las credenciales y devuelve un token JWT. */
export const login = async (data: LoginInput): Promise<AuthResponse> => {
    const user = await Users.findOne({
        where: { email: data.email.toLowerCase() },
    });

    // Mismo mensaje si el usuario no existe, está inactivo o la contraseña es
    // incorrecta: distinguirlos permitiría averiguar qué correos hay registrados.
    if (!user || !user.is_active) {
        throw new Error("Credenciales inválidas");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
        throw new Error("Credenciales inválidas");
    }

    const role = await Roles.findByPk(user.role_id);

    if (!role) {
        throw new Error("El usuario no tiene un rol válido asignado");
    }

    // El rol viaja dentro del token para que checkRole no tenga que consultar
    // la base en cada petición.
    const token = jwt.sign(
        { id: user.id, email: user.email, role: role.name },
        process.env.JWT_SECRET as string,
        { expiresIn: "8h" },
    );

    return { token };
};
