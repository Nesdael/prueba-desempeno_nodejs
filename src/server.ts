import db from './config/db.js';
import app from './app.js';

const {PORT} = process.env;

async function starServer(){
    try {
        // Prueba la conexion antes de levantar el server; si falla la DB no
        // tiene sentido seguir.
        await db.authenticate();
        console.log('DB online')

        // El esquema se maneja con migraciones (ver src/config/migrator.ts),
        // por eso el sync queda apagado.
        // await db.sync({alter: true})
        // console.log('DB sincronizada')

        app.listen(PORT, () => {
            console.log('Server running...')
        })
    } catch (error) {
        throw error
    }
}

starServer();