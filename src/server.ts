// Punto de entrada: conecta la base, sincroniza el esquema y levanta el
// servidor HTTP. Toda la configuración de Express vive en app.ts.
import db from './config/db.js';
import app from './app.js';

const { PORT, JWT_SECRET } = process.env;

// Sin la clave de firma el servidor arrancaría igual y fallaría en el primer
// login con un error confuso. Mejor cortar aquí.
if (!JWT_SECRET) {
    console.error('Falta la variable JWT_SECRET en el archivo .env');
    process.exit(1);
}

async function startServer() {
    try {
        // authenticate() lanza un SELECT 1 para comprobar la conexión antes de
        // levantar el servidor.
        await db.authenticate();
        console.log('DB online');

        // No hay migraciones: el esquema se crea y actualiza a partir de los
        // modelos. Cómodo en desarrollo; en producción lo correcto son
        // migraciones versionadas.
        await db.sync({ alter: true });
        console.log('DB sincronizada');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
