import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Clinics from "./clinics.model.js";
import Medications from "./medications.model.js";
import Warehouses from "./warehouses.model.js";
import Users from "./users.model.js";


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
            type: DataTypes.UUID,
            allowNull: false,
        },
        medication_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        warehouse_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 },
        },
        // Flujo de una solicitud: pendiente -> aprobada/rechazada -> entregada.
        // No hay todavia logica que fuerce ese orden, solo se valida que el
        // valor este dentro de este set.
        status: {
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
        timestamps: true,
        tableName: "Requests",
    },
);

Clinics.hasMany(Requests, { foreignKey: "clinic_id", as: "requests" });
Requests.belongsTo(Clinics, { foreignKey: "clinic_id", as: "clinic" });

Medications.hasMany(Requests, { foreignKey: "medication_id", as: "requests" });
Requests.belongsTo(Medications, { foreignKey: "medication_id", as: "medication" });

Warehouses.hasMany(Requests, { foreignKey: "warehouse_id", as: "requests" });
Requests.belongsTo(Warehouses, { foreignKey: "warehouse_id", as: "warehouse" });

Users.hasMany(Requests, { foreignKey: "user_id", as: "requests" });
Requests.belongsTo(Users, { foreignKey: "user_id", as: "user" });

export default Requests;