import { QueryInterface, QueryTypes } from "sequelize";
import { randomUUID } from "crypto";

interface CityRow {
    id: string;
    code_name: string;
}

export async function up({ context }: { context: QueryInterface }) {
    const cities = await context.sequelize.query<CityRow>(
        'SELECT id, code_name FROM "Cities"',
        { type: QueryTypes.SELECT },
    );

    const barranquilla = cities.find((city) => city.code_name === "08001");
    const bogota = cities.find((city) => city.code_name === "11001");

    if (!barranquilla || !bogota) throw new Error("Ciudades no encontradas");

    const now = new Date();

    await context.bulkInsert("Warehouses", [
        { id: randomUUID(), name: "Almacén Central Norte", address: "Calle 84 # 45-12", city_id: barranquilla.id, is_active: true, },
        { id: randomUUID(), name: "Almacén Bogotá", address: "Carrera 15 # 93-60", city_id: bogota.id, is_active: true, },
    ]);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete("Warehouses", {});
}