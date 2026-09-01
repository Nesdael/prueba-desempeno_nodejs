import { QueryInterface, QueryTypes } from "sequelize";
import { randomUUID } from "crypto";

interface NamedRow {
    id: string;
    name: string;
}

interface IdRow {
    id: string;
}

export async function up({ context }: { context: QueryInterface }) {
    const clinics = await context.sequelize.query<NamedRow>(
        'SELECT id, name FROM "Clinics"',
        { type: QueryTypes.SELECT },
    );

    const medications = await context.sequelize.query<NamedRow>(
        'SELECT id, name FROM "Medications"',
        { type: QueryTypes.SELECT },
    );

    const warehouses = await context.sequelize.query<IdRow>(
        `SELECT id FROM "Warehouses" WHERE name = 'Almacén Central Norte'`,
        { type: QueryTypes.SELECT },
    );

    const users = await context.sequelize.query<IdRow>(
        `SELECT id FROM "Users" WHERE email = 'laura@medicare.com'`,
        { type: QueryTypes.SELECT },
    );

    const caribe = clinics.find((clinic) => clinic.name === "Clínica del Caribe");
    const bahia = clinics.find((clinic) => clinic.name === "Clínica Bahía");
    const acetaminofen = medications.find((medication) => medication.name === "Acetaminofén");
    const ibuprofeno = medications.find((medication) => medication.name === "Ibuprofeno");
    const warehouse = warehouses[0];
    const manager = users[0];

    if (!caribe || !bahia || !acetaminofen || !ibuprofeno || !warehouse || !manager) {
        throw new Error("Datos base no encontrados");
    }

    const now = new Date();

    await context.bulkInsert("Requests", [
        {
            id: randomUUID(),
            clinic_id: caribe.id,
            medication_id: acetaminofen.id,
            warehouse_id: warehouse.id,
            user_id: manager.id,
            quantity: 20,
            status: "pendiente",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            clinic_id: bahia.id,
            medication_id: ibuprofeno.id,
            warehouse_id: warehouse.id,
            user_id: manager.id,
            quantity: 15,
            status: "aprobada",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete("Requests", {});
}
