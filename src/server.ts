import db from './config/db.js';
import app from './app.js';

const {PORT} = process.env;

/**
 * Funcion de arranque del servidor.
 * Es `async` porque `db.authenticate()` devuelve una promesa.
 */
async function starServer(){
    try {
        // authenticate() abre una conexion de prueba contra la base de datos.
        // Si las credenciales o el host estan mal, lanza error y no se levanta la API.
        await db.authenticate();
        console.log('DB online')

        // --- Sincronizacion automatica de esquema ---
        await db.sync({alter: true})
        console.log('DB sincronizada')

        // Levanta el servidor HTTP. A partir de aqui la API acepta peticiones.
        app.listen(PORT, () => {
            console.log('Server running...')
        })
    } catch (error) {
        // Se relanza el error para que el proceso falle de forma visible.
        // (Una mejora seria: console.error(error) + process.exit(1) para un log claro.)
        throw error
    }
}

// Invocacion inmediata: al importarse este modulo, el servidor arranca.
starServer();