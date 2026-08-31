import { Umzug, SequelizeStorage } from 'umzug';
import db from './db.js';

// Umzug lleva el registro de que migraciones ya corrieron en la tabla
// "migrations" para no volver a ejecutarlas.
export const migrator = new Umzug({
    migrations: {
        glob: 'src/migrations/*.ts'
    },
    context: db.getQueryInterface(),

    storage: new SequelizeStorage({
        sequelize: db,
        tableName: 'migrations',
        timestamps: true
    }),

    logger: console
});
