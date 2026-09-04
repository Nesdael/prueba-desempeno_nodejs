import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Cities from "./cities.model.js";

class Warehouses extends Model {
    declare id: string;
    declare name: string;
    declare city_id: string;
    declare address: string;
    declare is_active: boolean;
}

Warehouses.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        city_id: {
            type: DataTypes.UUID,   // FK -> Cities.id
            allowNull: false
        },
        address: {
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
        tableName: 'Warehouses'
    }
);

// Se declara en los dos sentidos: hasMany habilita el include desde Cities y
// belongsTo desde Warehouses. Ademas asi db.sync crea la FK real en Postgres.
Cities.hasMany(Warehouses, { foreignKey: 'city_id', as: 'warehouses' });
Warehouses.belongsTo(Cities, { foreignKey: 'city_id', as: 'city' });

export default Warehouses;
