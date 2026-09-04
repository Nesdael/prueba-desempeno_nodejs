import express from 'express'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
// Solo por el efecto secundario: registra los modelos y sus asociaciones en
// Sequelize antes de que llegue la primera petición.
import './models/associations.js';
import router from './routes/index.routes.js';

const app = express()

// Parsea el body de las peticiones con Content-Type: application/json.
app.use(express.json());

// Documentación interactiva generada a partir de los @swagger de las rutas.
app.use('/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)

// Todas las rutas cuelgan de /api.
app.use('/api', router)

// Cualquier URL que no coincida con lo anterior. Sin esto Express devolvería
// su página HTML de error por defecto, que rompe el formato JSON de la API.
app.use((req, res) => {
    res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

export default app;
