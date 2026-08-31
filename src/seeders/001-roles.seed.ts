import { QueryInterface } from "sequelize";
import { randomUUID } from "crypto";

export async function up({ context }: { context: QueryInterface }) {
    await context.bulkInsert("Roles", [
        { id: randomUUID(), 
            name: "admin", 
        },
        { id: randomUUID(), 
            name: "manager", 
        },
    ]);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete("Roles", {});
}