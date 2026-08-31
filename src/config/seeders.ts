import { SequelizeStorage, Umzug } from "umzug"
import db from "./db.js"

// Mismo mecanismo que el migrator pero para datos (tabla SequelizeData),
// asi se pueden correr los seeders sin duplicar registros.
export const seeder = new Umzug({
    migrations:{
        glob: 'src/seeders/*.ts'
    },
    context: db.getQueryInterface(),

    storage: new SequelizeStorage({
        sequelize: db,
        modelName: 'SequelizeData',
        timestamps: true
    }),
    logger: console
});
