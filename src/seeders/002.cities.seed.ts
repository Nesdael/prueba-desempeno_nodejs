import { QueryInterface } from "sequelize";
import { randomUUID } from "crypto";

export async function up({ context }: { context: QueryInterface }) {
    await context.bulkInsert("Cities", [
        { 
            id: randomUUID(), 
            name: "Barranquilla", 
            code_name: "08001", 
            is_active: true },
        { 
            id: randomUUID(), 
            name: "Bogotá", 
            code_name: "11001", 
            is_active: true },
        { 
            id: randomUUID(), 
            name: "Medellín", 
            code_name: "05001", 
            is_active: true },
    ]);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete("Cities", {});
}