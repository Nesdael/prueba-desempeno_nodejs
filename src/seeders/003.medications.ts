import { QueryInterface } from "sequelize";
import { randomUUID } from "crypto";

export async function up({ context }: { context: QueryInterface }) {

    await context.bulkInsert("Medications", [
        { 
            id: randomUUID(), 
            name: "Acetaminofén", 
            presentation: "Tableta 500mg", 
            is_active: true
        },
        { 
            id: randomUUID(), 
            name: "Ibuprofeno", 
            presentation: "Tableta 400mg", 
            is_active: true 
        },
        { id: randomUUID(), 
            name: "Amoxicilina", 
            presentation: "Cápsula 500mg", 
            is_active: true, 
            
        },
        { id: randomUUID(), 
            name: "Dipirona", 
            presentation: "Ampolla 2ml", 
            is_active: true, 
        },
    ]);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete("Medications", {});
}