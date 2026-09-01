import Clinics from "../models/clinics.model.js";
import Cities from "../models/cities.model.js";
import Users from "../models/users.model.js";
import type { CreateClinicInput, UpdateClinicInput } from "../dto/clinics.schema.js";

/** Verifica que la ciudad exista y esté activa. */
const validateCity = async (cityId: string): Promise<void> => {
    const city = await Cities.findOne({ where: { id: cityId, is_active: true } });

    if (!city) {
        throw new Error("La ciudad indicada no existe");
    }
};

/** Verifica que el responsable exista y esté activo. */
const validateManager = async (managerId: string): Promise<void> => {
    const manager = await Users.findOne({ where: { id: managerId, is_active: true } });

    if (!manager) {
        throw new Error("El responsable indicado no existe");
    }
};

/** Verifica que el NIT no esté registrado en otra clínica. */
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
        include: [
            { model: Cities, as: "city" },
            { model: Users, as: "manager", attributes: ["id", "name", "email"] },
        ],
    });
};

/** Devuelve una clínica activa por su id. */
export const findById = async (id: string): Promise<Clinics> => {
    const clinic = await Clinics.findOne({
        where: { id, is_active: true },
        include: [
            { model: Cities, as: "city" },
            { model: Users, as: "manager", attributes: ["id", "name", "email"] },
        ],
    });

    if (!clinic) {
        throw new Error("Clínica no encontrada");
    }

    return clinic;
};

/** Crea una clínica validando NIT único, ciudad y responsable. */
export const create = async (data: CreateClinicInput): Promise<Clinics> => {
    await validateNit(data.nit);
    await validateCity(data.city_id);
    await validateManager(data.manager_id);

    return await Clinics.create({ ...data });
};

/** Actualiza una clínica existente. */
export const update = async (id: string, data: UpdateClinicInput): Promise<Clinics> => {
    const clinic = await findById(id);

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

/** Elimina lógicamente una clínica. */
export const remove = async (id: string): Promise<void> => {
    const clinic = await findById(id);
    await clinic.update({ is_active: false });
};