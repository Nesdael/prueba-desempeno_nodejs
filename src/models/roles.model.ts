import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Roles extends Model{
    declare id: string;
    declare name: string;
};

Roles.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate:{
                isIn: [["admin", "manager"]]
            }
        }
    },{
        sequelize: db,
        timestamps: false,
        tableName: "Roles"
    }
)

export default Roles;