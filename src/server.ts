import db from './config/db.js';
import app from './app.js';

const {PORT} = process.env;

async function starServer(){
    try {
        // Prueba la conexion antes de levantar el server; si falla la DB no
        // tiene sentido seguir.
        await db.authenticate();
        console.log('DB online')

        // No hay migraciones: el esquema se crea/actualiza a partir de los
        // modelos cada vez que arranca el server.
        await db.sync({ alter: true })
        console.log('DB sincronizada')

        app.listen(PORT, () => {
            console.log('Server running...')
        })
    } catch (error) {
        throw error
    }
}

starServer();