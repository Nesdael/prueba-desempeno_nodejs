import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Medications extends Model {
    declare id: string;
    declare name: string;
    declare presentation: string;
    declare is_active: boolean;
}

Medications.init(
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
        presentation: {
            // Forma farmaceutica y dosis: "Tableta 500mg", "Ampolla 2ml".
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize: db,
        timestamps: false,
        tableName: "Medications",
        // Lo unico es la combinacion nombre + presentacion, no el nombre solo:
        // asi pueden convivir "Ibuprofeno 400mg" e "Ibuprofeno 600mg".
        indexes: [
            {
                unique: true,
                fields: ['name', 'presentation']
            }
        ]
    }
);

export default Medications;
