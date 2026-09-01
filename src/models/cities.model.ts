import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Cities extends Model {
    declare id: string;
    declare name: string;
    declare code_name: string;
    declare is_active: boolean;
}

Cities.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code_name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        // Borrado logico en vez de DELETE: hay tablas que referencian ciudades
        // (Clinics, Warehouses) y no queremos perder el historico.
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    },
    {
        sequelize: db,
        timestamps: false,
        tableName: 'Cities'
    }
);

export default Cities;