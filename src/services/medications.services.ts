import type { CreateMedicationInput, UpdateMedicationInput } from "../dto/medications.schema.js";
import Medications from "../models/medications.model.js";


/** Devuelve todos los medicamentos activos. */
export const findAll = async (): Promise<Medications[]> => {
    return await Medications.findAll({ where: { is_active: true } });
};

/** Devuelve un medicamento activo por su id. */
export const findById = async (id: string): Promise<Medications> => {
    const medication = await Medications.findOne({
        where: { id, is_active: true },
    });

    if (!medication) {
        throw new Error("Medicamento no encontrado");
    }

    return medication;
};

// esta validacion se hace aca ademas del indice unico del modelo para poder
// devolver un mensaje claro antes de que Sequelize tire el error de la DB
/** Crea un medicamento validando que no exista la misma combinación. */
export const create = async (data: CreateMedicationInput): Promise<Medications> => {
    const existing = await Medications.findOne({
        where: { name: data.name, presentation: data.presentation },
    });

    if (existing) {
        throw new Error("Ya existe un medicamento con ese nombre y presentación");
    }

    return await Medications.create({ ...data });
};

/** Actualiza los datos de un medicamento existente. */
export const update = async (id: string, data: UpdateMedicationInput): Promise<Medications> => {
    const medication = await findById(id);
    return await medication.update(data);
};

/** Elimina lógicamente un medicamento marcándolo como inactivo. */
export const remove = async (id: string): Promise<void> => {
    const medication = await findById(id);
    await medication.update({ is_active: false });
};