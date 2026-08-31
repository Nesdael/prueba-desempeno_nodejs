import { QueryInterface, QueryTypes } from "sequelize";
import { randomUUID } from "crypto";

interface IdRow {
    id: string;
}

export async function up({ context }: { context: QueryInterface }) {
    const cities = await context.sequelize.query<IdRow>(
        `SELECT id FROM "Cities" WHERE code_name = '08001'`,
        { type: QueryTypes.SELECT },
    );

    const users = await context.sequelize.query<IdRow>(
        `SELECT id FROM "Users" WHERE email = 'laura@medicare.com'`,
        { type: QueryTypes.SELECT },
    );

    const city = cities[0];
    const manager = users[0];

    if (!city || !manager) throw new Error("Datos base no encontrados");

    const now = new Date();

    await context.bulkInsert("Clinics", [
        {
            id: randomUUID(),
            name: "Clínica del Caribe",
            nit: "890102345-1",
            address: "Calle 80 # 49-40",
            city_id: city.id,
            manager_id: manager.id,
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Clínica Bahía",
            nit: "890205671-4",
            address: "Carrera 51B # 87-50",
            city_id: city.id,
            manager_id: manager.id,
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete("Clinics", {});
}