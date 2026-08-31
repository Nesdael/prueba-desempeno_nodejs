import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Cities from "./cities.model.js";
import Users from "./users.model.js";

class Clinics extends Model {
    declare id: string;
    declare name: string;
    declare nit: string;
    declare address: string;
    declare city_id: string;
    declare manager_id: string;
    declare is_active: boolean;
}

Clinics.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nit: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        manager_id: {
            type: DataTypes.UUID,
            allowNull: false,
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
        tableName: "Clinics",
    },
);

Cities.hasMany(Clinics, { foreignKey: "city_id", as: "clinics" });
Clinics.belongsTo(Cities, { foreignKey: "city_id", as: "city" });

Users.hasMany(Clinics, { foreignKey: "manager_id", as: "managedClinics" });
Clinics.belongsTo(Users, { foreignKey: "manager_id", as: "manager" });

export default Clinics;