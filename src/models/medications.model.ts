import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Medications extends Model{
    declare id: string;
    declare name: string;
    declare presentation: string;
    declare is_active: boolean;
};

Medications.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        presentation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },{
        sequelize: db,
        timestamps: false,
        tableName: "Medications",
        indexes: [
            {
            unique: true,
            fields: ['name', 'presentation']
            }
        ]   
    }
);

export default Medications;