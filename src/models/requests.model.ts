import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Clinics from "./clinics.model.js";
import Medications from "./medications.model.js";
import Warehouses from "./warehouses.model.js";
import Users from "./users.model.js";

// Entidad central: "la clinica X le pide al almacen Y una cantidad Z del
// medicamento M, y el usuario U la registro". De ahi sus cuatro FK.
class Requests extends Model {
    declare id: string;
    declare clinic_id: string;
    declare medication_id: string;
    declare warehouse_id: string;
    declare user_id: string;
    declare quantity: number;
    declare status: string;
    declare is_active: boolean;
}

Requests.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        clinic_id: {
            type: DataTypes.UUID,   // FK -> Clinics.id (quien pide)
            allowNull: false,
        },
        medication_id: {
            type: DataTypes.UUID,   // FK -> Medications.id (que se pide)
            allowNull: false,
        },
        warehouse_id: {
            type: DataTypes.UUID,   // FK -> Warehouses.id (a quien se le pide)
            allowNull: false,
        },
        user_id: {
            // FK -> Users.id. No viene del body: lo pone el controlador a
            // partir del token, para que nadie pueda suplantar a otro.
            type: DataTypes.UUID,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 },
        },
        status: {
            // pendiente -> aprobada / rechazada -> entregada.
            // "entregada" y "rechazada" son finales (ver requests.services.ts).
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pendiente",
            validate: {
                isIn: [["pendiente", "aprobada", "rechazada", "entregada"]],
            },
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize: db,
        // createdAt se usa para ordenar el historial de solicitudes.
        timestamps: true,
        tableName: "Requests",
    },
);

// Gracias a estas relaciones los servicios pueden hacer include y devolver los
// nombres de clinica, medicamento, almacen y usuario en vez de solo los UUID.
Clinics.hasMany(Requests, { foreignKey: "clinic_id", as: "requests" });
Requests.belongsTo(Clinics, { foreignKey: "clinic_id", as: "clinic" });

Medications.hasMany(Requests, { foreignKey: "medication_id", as: "requests" });
Requests.belongsTo(Medications, { foreignKey: "medication_id", as: "medication" });

Warehouses.hasMany(Requests, { foreignKey: "warehouse_id", as: "requests" });
Requests.belongsTo(Warehouses, { foreignKey: "warehouse_id", as: "warehouse" });

Users.hasMany(Requests, { foreignKey: "user_id", as: "requests" });
Requests.belongsTo(Users, { foreignKey: "user_id", as: "user" });

export default Requests;
