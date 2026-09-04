import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Roles from "./roles.model.js";
import bcrypt from "bcrypt";

class Users extends Model {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;   // guarda el hash, nunca la contrasena original
    declare is_active: boolean;
    declare role_id: string;
}

Users.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            // Un hash de bcrypt siempre mide 60 caracteres.
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        role_id: {
            type: DataTypes.UUID,   // FK -> Roles.id
            allowNull: false,
        },
    },
    {
        sequelize: db,
        timestamps: true,
        tableName: "Users",
    },
);

Roles.hasMany(Users, { foreignKey: "role_id", as: "users" });
Users.belongsTo(Roles, { foreignKey: "role_id", as: "role" });

// Hook: normaliza el email y hashea la contrasena antes de cada INSERT.
// Al estar en el modelo se aplica siempre, sin importar quien llame a create().
// Ojo: los hooks NO se disparan con bulkInsert, por eso los seeders hashean a mano.
Users.beforeCreate(async (user) => {
    user.email = user.email.toLowerCase();
    user.password = await bcrypt.hash(user.password, 10);
});

export default Users;
