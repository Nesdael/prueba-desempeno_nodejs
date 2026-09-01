import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Cities from "./cities.model.js";

class Warehouses extends Model{
    declare id: string;
    declare name: string;
    declare city_id: string;
    declare address: string;
    declare is_active: boolean;
};

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
            unique: true // no puede haber dos almacenes con el mismo nombre
        },
        city_id: {
            type: DataTypes.UUID,
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

Cities.hasMany(Warehouses, { foreignKey: 'city_id', as: 'warehouses' });
Warehouses.belongsTo(Cities, { foreignKey: 'city_id', as: 'city' });

export default Warehouses;