import { Sequelize } from "sequelize";
import 'dotenv/config';

const {DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
} = process.env;

const db = new Sequelize(
    DATABASE_NAME || '',
    DATABASE_USER || '',
    DATABASE_PASSWORD || '',
    {
        host: DATABASE_HOST || 'localhost',

        dialect: 'postgres',

        port: Number(DATABASE_PORT) || 5342,

        define: {
            timestamps: false
        }
    }
);

export default db;

