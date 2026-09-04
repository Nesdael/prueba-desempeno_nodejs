import { Sequelize } from "sequelize";
import 'dotenv/config';

const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
} = process.env;

// Una sola instancia de Sequelize para toda la app: modelos y transacciones
// comparten el mismo pool de conexiones.
const db = new Sequelize(
    DATABASE_NAME || '',
    DATABASE_USER || '',
    DATABASE_PASSWORD || '',
    {
        host: DATABASE_HOST || 'localhost',
        dialect: 'postgres',
        port: Number(DATABASE_PORT) || 5432,
        // Cada modelo activa timestamps si los necesita.
        define: {
            timestamps: false
        }
    }
);

export default db;
