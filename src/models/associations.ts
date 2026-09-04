// Un modelo solo queda registrado en Sequelize cuando su archivo se ejecuta.
// app.ts importa este archivo para forzar la carga de los ocho de golpe.
// El orden importa: cada modelo debe cargarse despues de los que referencia.
import Cities from "./cities.model.js";
import Roles from "./roles.model.js";
import Medications from "./medications.model.js";
import Warehouses from "./warehouses.model.js";
import Users from "./users.model.js";
import Clinics from "./clinics.model.js";
import Requests from "./requests.model.js";
import Inventories from "./inventories.model.js";

export {
    Cities,
    Roles,
    Medications,
    Warehouses,
    Users,
    Clinics,
    Inventories,
    Requests,
};
