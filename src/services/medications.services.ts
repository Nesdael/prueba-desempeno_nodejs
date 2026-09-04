import type { CreateMedicationInput, UpdateMedicationInput } from "../dto/medications.schema.js";
import Medications from "../models/medications.model.js";

/** Devuelve todos los medicamentos activos. */
export const findAll = async (): Promise<Medications[]> => {
    // El filtro is_active implementa el borrado lógico.
    return await Medications.findAll({ where: { is_active: true } });
};

/** Devuelve un medicamento activo por su id, o null si no existe. */
export const findById = async (id: string): Promise<Medications | null> => {
    return await Medications.findOne({ where: { id, is_active: true } });
};

/** Crea un medicamento. Lanza error si ya existe esa combinación. */
export const create = async (data: CreateMedicationInput): Promise<Medications> => {
    // Se valida aquí además del índice único del modelo para devolver un
    // mensaje claro en vez del error crudo de PostgreSQL.
    const existing = await Medications.findOne({
        where: { name: data.name, presentation: data.presentation },
    });

    if (existing) {
        throw new Error("Ya existe un medicamento con ese nombre y presentación");
    }

    return await Medications.create({ ...data });
};

/** Actualiza un medicamento. Devuelve null si no existe. */
export const update = async (id: string, data: UpdateMedicationInput): Promise<Medications | null> => {
    const medication = await findById(id);

    if (!medication) {
        return null;
    }

    // Si cambia el nombre o la presentación, hay que comprobar que la nueva
    // combinación no la tenga ya otro medicamento.
    const name = data.name ?? medication.name;
    const presentation = data.presentation ?? medication.presentation;

    if (name !== medication.name || presentation !== medication.presentation) {
        const existing = await Medications.findOne({ where: { name, presentation } });

        if (existing) {
            throw new Error("Ya existe un medicamento con ese nombre y presentación");
        }
    }

    return await medication.update(data);
};

/** Elimina lógicamente un medicamento. Devuelve false si no existe. */
export const remove = async (id: string): Promise<boolean> => {
    const medication = await findById(id);

    if (!medication) {
        return false;
    }

    // Borrado lógico: hay solicitudes históricas que apuntan a este
    // medicamento y un DELETE real rompería esas referencias.
    await medication.update({ is_active: false });
    return true;
};
