import { QueryInterface, QueryTypes } from "sequelize";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

interface RoleRow {
    id: string;
    name: string;
}

export async function up({ context }: { context: QueryInterface }) {
    const roles = await context.sequelize.query<RoleRow>(
        'SELECT id, name FROM "Roles"',
        { type: QueryTypes.SELECT },
    );

    const admin = roles.find((role) => role.name === "admin");
    const manager = roles.find((role) => role.name === "manager");

    if (!admin || !manager) throw new Error("Roles no encontrados");

    const now = new Date();

    await context.bulkInsert("Users", [
        {
            id: randomUUID(),
            name: "Nestor Duran",
            email: "admin@medicare.com",
            password: await bcrypt.hash("Admin123", 10),
            role_id: admin.id,
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Laura Pérez",
            email: "laura@medicare.com",
            password: await bcrypt.hash("Manager123", 10),
            role_id: manager.id,
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete("Users", {});
}