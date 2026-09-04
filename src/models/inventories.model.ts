import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Warehouses from "./warehouses.model.js";
import Medications from "./medications.model.js";

// Tabla intermedia entre Warehouses y Medications. Se modela como entidad
// propia (y no con belongsToMany) porque la relacion tiene un dato suyo: la
// cantidad disponible.
class Inventories extends Model {
    declare id: string;
    declare warehouse_id: string;
    declare medication_id: string;
    declare quantity: number;
    declare is_active: boolean;
}

Inventories.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        warehouse_id: {
            type: DataTypes.UUID,   // FK -> Warehouses.id
            allowNull: false,
        },
        medication_id: {
            type: DataTypes.UUID,   // FK -> Medications.id
            allowNull: false,
        },
        quantity: {
            // Se descuenta al crear una solicitud y se devuelve si se rechaza.
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
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
        tableName: "Inventories",
        // Una sola fila de stock por almacen y medicamento. Garantizado en la
        // base, no solo en el codigo.
        indexes: [{ unique: true, fields: ["warehouse_id", "medication_id"] }],
    },
);

Warehouses.hasMany(Inventories, { foreignKey: "warehouse_id", as: "inventories" });
Inventories.belongsTo(Warehouses, { foreignKey: "warehouse_id", as: "warehouse" });

Medications.hasMany(Inventories, { foreignKey: "medication_id", as: "inventories" });
Inventories.belongsTo(Medications, { foreignKey: "medication_id", as: "medication" });

export default Inventories;
