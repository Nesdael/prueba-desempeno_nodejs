import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Roles from "./roles.model.js";
import bcrypt from "bcrypt";

class Users extends Model {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
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
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    role_id: {
        type: DataTypes.UUID,
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

Users.beforeCreate(async (user) => {
    user.email = user.email.toLowerCase();
    user.password = await bcrypt.hash(user.password, 10);
});

export default Users;