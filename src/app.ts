/**
 * =============================================================================
 * src/app.ts  —  CONFIGURACION DE LA APLICACION EXPRESS
 * =============================================================================
 * Aqui se construye el objeto `app` de Express: se registran los middlewares
 * globales, la documentacion Swagger y el enrutador principal. No se llama a
 * `listen()` (eso lo hace server.ts), por lo que este modulo es reutilizable
 * en tests.
 * =============================================================================
 */

import express from 'express'

// Interfaz web de la documentacion.
import swaggerUi from 'swagger-ui-express';

// Enrutador raiz: agrupa todas las rutas de la API bajo un solo objeto.
// import router from './routes/index.routes.js';

// Especificacion OpenAPI generada a partir de los comentarios @openapi.
// import { swaggerSpec } from './config/swagger.js';

// Import "de efecto secundario" (no se guarda en ninguna variable).
// Sirve para forzar que TODOS los modelos y sus asociaciones se registren en
// Sequelize antes de atender la primera peticion. Si no se importara, un
// `include` de un modelo aun no cargado podria fallar.
import './models/associations.js';


const app = express()

// Middleware nativo de Express que parsea cuerpos JSON.
// Sin esto, `req.body` llegaria `undefined` en los POST/PATCH.
app.use(express.json());

// --- DOCUMENTACION SWAGGER ---
// Pagina interactiva:  http://localhost:3000/api/docs
//   swaggerUi.serve  entrega los archivos de la interfaz (css, js)
//   swaggerUi.setup  construye la pagina a partir de la especificacion
// app.use('/api/docs', 
//     swaggerUi.serve, 
//     swaggerUi.setup(swaggerSpec)
// )


// Monta todas las rutas bajo el prefijo /api.
// Ej: la ruta '/users' definida dentro del router se expone como /api/users.
// app.use('/api', router)

export default app;
