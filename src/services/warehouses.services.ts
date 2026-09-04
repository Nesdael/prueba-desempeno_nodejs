import Warehouses from "../models/warehouses.model.js";
import Cities from "../models/cities.model.js";
import type { CreateWarehouseInput, UpdateWarehouseInput } from "../dto/warehouses.schema.js";

/** Comprueba que la ciudad exista y esté activa. */
const validateCity = async (cityId: string): Promise<void> => {
    const city = await Cities.findOne({ where: { id: cityId, is_active: true } });

    if (!city) {
        throw new Error("La ciudad indicada no existe");
    }
};

/** Devuelve todos los almacenes activos con su ciudad. */
export const findAll = async (): Promise<Warehouses[]> => {
    return await Warehouses.findAll({
        where: { is_active: true },
        // include es un JOIN: devuelve la ciudad anidada en vez de solo city_id.
        include: [{ model: Cities, as: "city" }],
    });
};

/** Devuelve un almacén activo por su id, o null si no existe. */
export const findById = async (id: string): Promise<Warehouses | null> => {
    return await Warehouses.findOne({
        where: { id, is_active: true },
        include: [{ model: Cities, as: "city" }],
    });
};

/** Crea un almacén validando que la ciudad exista. */
export const create = async (data: CreateWarehouseInput): Promise<Warehouses> => {
    await validateCity(data.city_id);
    return await Warehouses.create({ ...data });
};

/** Actualiza un almacén. Devuelve null si no existe. */
export const update = async (id: string, data: UpdateWarehouseInput): Promise<Warehouses | null> => {
    const warehouse = await findById(id);

    if (!warehouse) {
        return null;
    }

    // El update es parcial, así que city_id puede no venir en el body.
    if (data.city_id) {
        await validateCity(data.city_id);
    }

    return await warehouse.update(data);
};

/** Elimina lógicamente un almacén. Devuelve false si no existe. */
export const remove = async (id: string): Promise<boolean> => {
    const warehouse = await findById(id);

    if (!warehouse) {
        return false;
    }

    await warehouse.update({ is_active: false });
    return true;
};
