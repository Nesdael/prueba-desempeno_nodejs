import Clinics from "../models/clinics.model.js";
import Cities from "../models/cities.model.js";
import Users from "../models/users.model.js";
import type { CreateClinicInput, UpdateClinicInput } from "../dto/clinics.schema.js";

// Relaciones que se devuelven en las consultas. attributes recorta las columnas
// del manager para que el hash de la contraseña no salga en la respuesta.
const includeRelations = [
    { model: Cities, as: "city" },
    { model: Users, as: "manager", attributes: ["id", "name", "email"] },
];

/** Comprueba que la ciudad exista y esté activa. */
const validateCity = async (cityId: string): Promise<void> => {
    const city = await Cities.findOne({ where: { id: cityId, is_active: true } });

    if (!city) {
        throw new Error("La ciudad indicada no existe");
    }
};

/** Comprueba que el responsable exista y esté activo. */
const validateManager = async (managerId: string): Promise<void> => {
    const manager = await Users.findOne({ where: { id: managerId, is_active: true } });

    if (!manager) {
        throw new Error("El responsable indicado no existe");
    }
};

/** Comprueba que el NIT no esté registrado en otra clínica. */
const validateNit = async (nit: string): Promise<void> => {
    const existing = await Clinics.findOne({ where: { nit } });

    if (existing) {
        throw new Error("Ya existe una clínica registrada con ese NIT");
    }
};

/** Devuelve todas las clínicas activas con su ciudad y responsable. */
export const findAll = async (): Promise<Clinics[]> => {
    return await Clinics.findAll({
        where: { is_active: true },
        include: includeRelations,
    });
};

/** Devuelve una clínica activa por su id, o null si no existe. */
export const findById = async (id: string): Promise<Clinics | null> => {
    return await Clinics.findOne({
        where: { id, is_active: true },
        include: includeRelations,
    });
};

/** Crea una clínica validando NIT único, ciudad y responsable. */
export const create = async (data: CreateClinicInput): Promise<Clinics> => {
    await validateNit(data.nit);
    await validateCity(data.city_id);
    await validateManager(data.manager_id);

    return await Clinics.create({ ...data });
};

/** Actualiza una clínica. Devuelve null si no existe. */
export const update = async (id: string, data: UpdateClinicInput): Promise<Clinics | null> => {
    const clinic = await findById(id);

    if (!clinic) {
        return null;
    }

    // El NIT solo se valida si cambia: si fuera el mismo, validateNit
    // encontraría la propia clínica y fallaría.
    if (data.nit && data.nit !== clinic.nit) {
        await validateNit(data.nit);
    }

    if (data.city_id) {
        await validateCity(data.city_id);
    }

    if (data.manager_id) {
        await validateManager(data.manager_id);
    }

    return await clinic.update(data);
};

/** Elimina lógicamente una clínica. Devuelve false si no existe. */
export const remove = async (id: string): Promise<boolean> => {
    const clinic = await findById(id);

    if (!clinic) {
        return false;
    }

    await clinic.update({ is_active: false });
    return true;
};
