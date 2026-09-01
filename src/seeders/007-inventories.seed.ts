import { QueryInterface, QueryTypes } from "sequelize";
import { randomUUID } from "crypto";

interface NamedRow {
    id: string;
    name: string;
}

export async function up({ context }: { context: QueryInterface }) {
    const warehouses = await context.sequelize.query<NamedRow>(
        `SELECT id, name FROM "Warehouses" WHERE name = 'Almacén Central Norte'`,
        { type: QueryTypes.SELECT },
    );

    const medications = await context.sequelize.query<NamedRow>(
        'SELECT id, name FROM "Medications"',
        { type: QueryTypes.SELECT },
    );

    const warehouse = warehouses[0];

    if (!warehouse) throw new Error("Almacén no encontrado");

    const now = new Date();

    const quantities: Record<string, number> = {
        "Acetaminofén": 500,
        "Ibuprofeno": 300,
        "Amoxicilina": 150,
        "Dipirona": 5,
    };

    const records = medications.map((medication) => ({
        id: randomUUID(),
        warehouse_id: warehouse.id,
        medication_id: medication.id,
        quantity: quantities[medication.name] ?? 100,
        is_active: true,
        createdAt: now,
        updatedAt: now,
    }));

    await context.bulkInsert("Inventories", records);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete("Inventories", {});
}