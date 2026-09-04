import { Transaction } from "sequelize";
import db from "../config/db.js";
import Requests from "../models/requests.model.js";
import Clinics from "../models/clinics.model.js";
import Medications from "../models/medications.model.js";
import Warehouses from "../models/warehouses.model.js";
import Inventories from "../models/inventories.model.js";
import Users from "../models/users.model.js";
import type { CreateRequestInput } from "../dto/requests.schema.js";

// Estados que ya no admiten cambios: la solicitud terminó su ciclo.
const FINAL_STATUSES = ["entregada", "rechazada"];

// Se reutiliza en todas las consultas para no repetir el include. attributes
// recorta las columnas, sobre todo las del usuario (nada de password).
const includeRelations = [
    { model: Clinics, as: "clinic", attributes: ["id", "name", "nit"] },
    { model: Medications, as: "medication", attributes: ["id", "name", "presentation"] },
    { model: Warehouses, as: "warehouse", attributes: ["id", "name"] },
    { model: Users, as: "user", attributes: ["id", "name", "email"] },
];

/**
 * Crea una solicitud de abastecimiento.
 * Valida clínica, medicamento, almacén e inventario, y descuenta el stock.
 * Las dos escrituras van en una transacción: o pasan las dos o no pasa ninguna.
 */
export const create = async (data: CreateRequestInput, userId: string): Promise<Requests> => {
    const transaction = await db.transaction();

    try {
        // Todas las consultas llevan `transaction` para ejecutarse dentro de
        // ella; si se omite, irían por otra conexión y no verían los cambios
        // pendientes de confirmar.
        const clinic = await Clinics.findOne({
            where: { id: data.clinic_id, is_active: true },
            transaction,
        });

        if (!clinic) {
            throw new Error("La clínica indicada no existe");
        }

        const medication = await Medications.findOne({
            where: { id: data.medication_id, is_active: true },
            transaction,
        });

        if (!medication) {
            throw new Error("El medicamento indicado no existe");
        }

        const warehouse = await Warehouses.findOne({
            where: { id: data.warehouse_id, is_active: true },
            transaction,
        });

        if (!warehouse) {
            throw new Error("El almacén indicado no existe");
        }

        const inventory = await Inventories.findOne({
            where: {
                warehouse_id: data.warehouse_id,
                medication_id: data.medication_id,
                is_active: true,
            },
            transaction,
            // Bloquea la fila hasta el commit. Sin esto, dos peticiones
            // simultáneas podrían leer el mismo stock y descontar de más.
            lock: Transaction.LOCK.UPDATE,
        });

        if (!inventory) {
            // No hay fila = ese almacén no trabaja ese medicamento.
            // Distinto de "hay fila con cantidad 0" (sí lo maneja, sin stock).
            throw new Error("El almacén no maneja ese medicamento");
        }

        if (inventory.quantity < data.quantity) {
            throw new Error(
                `Inventario insuficiente. Disponible: ${inventory.quantity}, solicitado: ${data.quantity}`,
            );
        }

        // Escritura 1: descontar el stock.
        await inventory.update(
            { quantity: inventory.quantity - data.quantity },
            { transaction },
        );

        // Escritura 2: crear la solicitud. user_id llega del controlador (que
        // lo sacó del token) y el estado arranca siempre en "pendiente".
        const request = await Requests.create(
            { ...data, user_id: userId, status: "pendiente" },
            { transaction },
        );

        await transaction.commit();

        // Se relee para devolverla con sus relaciones. Va fuera de la
        // transacción, y es correcto porque el commit ya ocurrió.
        return await Requests.findOne({
            where: { id: request.id },
            include: includeRelations,
        }) as Requests;
    } catch (error) {
        // Deshace todo lo hecho dentro de la transacción, incluido el descuento.
        await transaction.rollback();
        throw error;
    }
};

/** Devuelve una solicitud activa por su id, o null si no existe. */
export const findById = async (id: string): Promise<Requests | null> => {
    return await Requests.findOne({
        where: { id, is_active: true },
        include: includeRelations,
    });
};

/** Devuelve las solicitudes activas, de la más reciente a la más antigua. */
export const findActive = async (): Promise<Requests[]> => {
    return await Requests.findAll({
        where: { is_active: true },
        include: includeRelations,
        order: [["createdAt", "DESC"]],
    });
};

/**
 * Devuelve el historial completo de una clínica, incluidas las solicitudes
 * eliminadas. Devuelve null si la clínica no existe.
 */
export const findByClinic = async (clinicId: string): Promise<Requests[] | null> => {
    // Se comprueba primero la clínica para distinguir "no existe" de
    // "existe pero no tiene solicitudes" (array vacío).
    const clinic = await Clinics.findByPk(clinicId);

    if (!clinic) {
        return null;
    }

    return await Requests.findAll({
        where: { clinic_id: clinicId },
        include: includeRelations,
        order: [["createdAt", "DESC"]],
    });
};

/**
 * Cambia el estado de una solicitud. Si se rechaza, devuelve la cantidad al
 * inventario. Devuelve null si la solicitud no existe.
 */
export const updateStatus = async (id: string, status: string): Promise<Requests | null> => {
    const transaction = await db.transaction();

    try {
        const request = await Requests.findOne({
            where: { id, is_active: true },
            transaction,
        });

        if (!request) {
            await transaction.rollback();
            return null;
        }

        // Máquina de estados simplificada: evita, por ejemplo, rechazar dos
        // veces la misma solicitud y devolver el stock por duplicado.
        if (FINAL_STATUSES.includes(request.status)) {
            throw new Error(`No se puede modificar una solicitud ${request.status}`);
        }

        // El stock se descontó al crear la solicitud, así que rechazarla
        // implica devolverlo al inventario.
        if (status === "rechazada") {
            await returnStock(request, transaction);
        }

        await request.update({ status }, { transaction });
        await transaction.commit();

        return await findById(id);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Elimina lógicamente una solicitud. Si todavía estaba en curso, devuelve el
 * stock al inventario. Devuelve false si la solicitud no existe.
 */
export const remove = async (id: string): Promise<boolean> => {
    const transaction = await db.transaction();

    try {
        const request = await Requests.findOne({
            where: { id, is_active: true },
            transaction,
        });

        if (!request) {
            await transaction.rollback();
            return false;
        }

        // Si la solicitud seguía en curso, el stock sigue reservado y hay que
        // devolverlo. Si ya se entregó o se rechazó, no se toca el inventario.
        if (!FINAL_STATUSES.includes(request.status)) {
            await returnStock(request, transaction);
        }

        await request.update({ is_active: false }, { transaction });
        await transaction.commit();

        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/** Devuelve al inventario la cantidad reservada por una solicitud. */
const returnStock = async (request: Requests, transaction: Transaction): Promise<void> => {
    const inventory = await Inventories.findOne({
        where: {
            warehouse_id: request.warehouse_id,
            medication_id: request.medication_id,
        },
        transaction,
        lock: Transaction.LOCK.UPDATE,
    });

    // Si la línea de inventario ya no existe simplemente no se devuelve nada,
    // en vez de romper la operación.
    if (inventory) {
        await inventory.update(
            { quantity: inventory.quantity + request.quantity },
            { transaction },
        );
    }
};
