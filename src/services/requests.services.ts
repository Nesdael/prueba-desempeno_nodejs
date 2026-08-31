import db from "../config/db.js";
import Requests from "../models/requests.model.js";
import Clinics from "../models/clinics.model.js";
import Medications from "../models/medications.model.js";
import Warehouses from "../models/warehouses.model.js";
import Inventories from "../models/inventories.model.js";
import Users from "../models/users.model.js";
import type { CreateRequestInput } from "../dto/requests.schema.js";


// se reutiliza en todos los finds de abajo para no repetir el include
const includeRelations = [
    { model: Clinics, as: "clinic", attributes: ["id", "name", "nit"] },
    { model: Medications, as: "medication", attributes: ["id", "name", "presentation"] },
    { model: Warehouses, as: "warehouse", attributes: ["id", "name"] },
    { model: Users, as: "user", attributes: ["id", "name", "email"] },
];

/**
 * Crea una solicitud de abastecimiento.
 * Valida existencia de clínica, medicamento y almacén, verifica que haya
 * inventario suficiente y descuenta el stock dentro de una transacción.
 */
export const create = async (data: CreateRequestInput, userId: string): Promise<Requests> => {
    // todo dentro de una sola transaccion: si algo falla despues de descontar
    // el stock (por ejemplo el create de abajo), el rollback lo devuelve
    const transaction = await db.transaction();

    try {
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
        });

        if (!inventory) {
            throw new Error("El almacén no maneja ese medicamento");
        }

        if (inventory.quantity < data.quantity) {
            throw new Error(
                `Inventario insuficiente. Disponible: ${inventory.quantity}, solicitado: ${data.quantity}`,
            );
        }

        await inventory.update(
            { quantity: inventory.quantity - data.quantity },
            { transaction },
        );

        const request = await Requests.create(
            { ...data, user_id: userId, status: "pendiente" },
            { transaction },
        );

        await transaction.commit();

        return await findById(request.id);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/** Devuelve una solicitud por su id con sus relaciones. */
export const findById = async (id: string): Promise<Requests> => {
    const request = await Requests.findOne({
        where: { id, is_active: true },
        include: includeRelations,
    });

    if (!request) {
        throw new Error("Solicitud no encontrada");
    }

    return request;
};

/** Devuelve las solicitudes activas, de la más reciente a la más antigua. */
export const findActive = async (): Promise<Requests[]> => {
    return await Requests.findAll({
        where: { is_active: true },
        include: includeRelations,
        order: [["createdAt", "DESC"]],
    });
};

// a diferencia de findActive, aca no se filtra por is_active: es el
// historial completo de la clinica, incluidas las eliminadas
/** Devuelve el historial completo de solicitudes de una clínica. */
export const findByClinic = async (clinicId: string): Promise<Requests[]> => {
    const clinic = await Clinics.findByPk(clinicId);

    if (!clinic) {
        throw new Error("La clínica indicada no existe");
    }

    return await Requests.findAll({
        where: { clinic_id: clinicId },
        include: includeRelations,
        order: [["createdAt", "DESC"]],
    });
};

/**
 * Actualiza el estado de una solicitud.
 * Si se rechaza, devuelve la cantidad al inventario del almacén.
 */
export const updateStatus = async (id: string, status: string): Promise<Requests> => {
    const transaction = await db.transaction();

    try {
        const request = await Requests.findOne({
            where: { id, is_active: true },
            transaction,
        });

        if (!request) {
            throw new Error("Solicitud no encontrada");
        }

        // entregada/rechazada son estados finales, no se pueden reabrir
        if (request.status === "entregada" || request.status === "rechazada") {
            throw new Error(`No se puede modificar una solicitud ${request.status}`);
        }

        // el stock se descontó al crear la solicitud (ver create de arriba),
        // asi que rechazarla implica devolverlo al inventario
        if (status === "rechazada") {
            const inventory = await Inventories.findOne({
                where: {
                    warehouse_id: request.warehouse_id,
                    medication_id: request.medication_id,
                },
                transaction,
            });

            if (inventory) {
                await inventory.update(
                    { quantity: inventory.quantity + request.quantity },
                    { transaction },
                );
            }
        }

        await request.update({ status }, { transaction });

        await transaction.commit();

        return await findById(id);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/** Elimina lógicamente una solicitud. */
export const remove = async (id: string): Promise<void> => {
    const request = await findById(id);
    await request.update({ is_active: false });
};