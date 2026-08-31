// Arma el objeto `app` de Express (middlewares, rutas). No hace listen() aqui
// para que server.ts pueda levantarlo por separado y sea facil de testear.
import express from 'express'

import swaggerUi from 'swagger-ui-express';

// import router from './routes/index.routes.js';

// import { swaggerSpec } from './config/swagger.js';

// Solo se importa por el efecto secundario: registra los modelos y sus
// asociaciones en Sequelize antes de que llegue la primera peticion.
import './models/associations.js';
import router from './routes/index.routes.js';


const app = express()

app.use(express.json());

// Swagger pendiente por documentar, se deja comentado mientras tanto
// app.use('/api/docs',
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec)
// )


app.use('/api', router)

export default app;
