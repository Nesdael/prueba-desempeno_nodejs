import Warehouses from "../models/warehouses.model.js";
import Cities from "../models/cities.model.js";
import type { CreateWarehouseInput, UpdateWarehouseInput } from "../dto/warehouses.schema.js";

/** Verifica que la ciudad exista y esté activa. */
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
        include: [{ model: Cities, as: "city" }],
    });
};

/** Devuelve un almacén activo por su id. */
export const findById = async (id: string): Promise<Warehouses> => {
    const warehouse = await Warehouses.findOne({
        where: { id, is_active: true },
        include: [{ model: Cities, as: "city" }],
    });

    if (!warehouse) {
        throw new Error("Almacén no encontrado");
    }

    return warehouse;
};

/** Crea un almacén validando que la ciudad exista. */
export const create = async (data: CreateWarehouseInput): Promise<Warehouses> => {
    await validateCity(data.city_id);
    return await Warehouses.create({ ...data });
};

/** Actualiza un almacén existente. */
export const update = async (id: string, data: UpdateWarehouseInput): Promise<Warehouses> => {
    const warehouse = await findById(id);

    if (data.city_id) {
        await validateCity(data.city_id);
    }

    return await warehouse.update(data);
};

/** Elimina lógicamente un almacén. */
export const remove = async (id: string): Promise<void> => {
    const warehouse = await findById(id);
    await warehouse.update({ is_active: false });
};