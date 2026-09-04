# RiwiMediCare Plus API

API REST para gestionar solicitudes de abastecimiento de medicamentos entre clínicas y almacenes. Cubre el registro de clínicas y almacenes, el inventario de medicamentos por almacén y el ciclo completo de una solicitud, todo protegido con autenticación JWT y control de acceso por roles.

La regla central del sistema: crear una solicitud descuenta el stock del inventario del almacén dentro de la misma transacción de base de datos, y rechazarla lo devuelve. El inventario y las solicitudes nunca pueden quedar descuadrados.

## Autor

- **Nombre:** Nestor Daniel Duran Fuentes
- **Clan:** Centurión

## Tecnologías

| Herramienta | Para qué se usa |
| --- | --- |
| Node.js 18+ | Entorno de ejecución |
| TypeScript | Lenguaje, con el modo `strict` activado |
| Express 5 | Framework HTTP y cadena de middlewares |
| PostgreSQL 16 | Base de datos |
| Sequelize 6 | ORM, asociaciones y transacciones |
| Zod | Validación del cuerpo de las peticiones |
| JSON Web Token | Autenticación sin estado |
| bcrypt | Hash de contraseñas |
| Umzug | Ejecutor de los datos iniciales |
| Swagger | Documentación OpenAPI 3.0 generada desde las rutas |
| Docker Compose | Levanta la API y la base de datos juntas |

## Requisitos

Basta con cumplir los requisitos de **una** de las dos opciones.

**Con Docker (recomendada):** Docker Desktop 20.10+ y Git. No hace falta instalar Node ni PostgreSQL.

**Local:** Node.js 18+, PostgreSQL 14+ (probado en 16) y Git.

## Puesta en marcha

### Con Docker

```bash
git clone https://github.com/Nesdael/prueba-desempeno_nodejs.git
cd prueba-desempeno_nodejs
cp .env.example .env
docker compose up -d
docker compose exec api npm run seed
```

Arrancan dos contenedores en la misma red interna, la API y PostgreSQL, con comprobación de salud en la base de datos y un volumen para que los datos sobrevivan a un reinicio.

### Local

```bash
git clone https://github.com/Nesdael/prueba-desempeno_nodejs.git
cd prueba-desempeno_nodejs
npm install
cp .env.example .env
```

Crea una base de datos vacía con el nombre de `DATABASE_NAME` y arranca:

```bash
npm run dev
```

Deja el servidor corriendo y carga los datos iniciales desde una segunda terminal:

```bash
npm run seed
```

No hay migraciones. El esquema se crea y se mantiene sincronizado a partir de los modelos de Sequelize cada vez que arranca el servidor. Si todo va bien deberías ver:

```
DB online
DB sincronizada
Server running on http://localhost:3000
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores. El archivo está excluido de git a propósito.

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto en el que escucha la API |
| `DATABASE_HOST` | `localhost` en instalación local. Docker Compose lo sobrescribe a `db`, el nombre del servicio en la red interna |
| `DATABASE_PORT` | Puerto de PostgreSQL, normalmente `5432` |
| `DATABASE_USER` | Usuario de la base. En local debe coincidir con el de tu servidor |
| `DATABASE_PASSWORD` | Contraseña de la base |
| `DATABASE_NAME` | Nombre de la base. En local tiene que existir antes de arrancar |
| `JWT_SECRET` | Clave con la que se firman los tokens. **Usa una cadena larga y aleatoria en cualquier despliegue real.** El servidor no arranca sin ella |

## Scripts de npm

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Arranca el servidor con recarga automática |
| `npm run build` | Compila TypeScript en `dist/` |
| `npm start` | Ejecuta la versión compilada |
| `npm run seed` | Carga los datos iniciales |
| `npm run seed:down` | Revierte el último seeder aplicado |

## Datos iniciales

Los ocho scripts de `src/seeders/` se ejecutan en el orden que marca su prefijo numérico, para que las dependencias existan cuando se necesitan: los roles antes que los usuarios, las ciudades antes que los almacenes, los almacenes y medicamentos antes que el inventario. Umzug registra cuáles ya se aplicaron, así que ejecutar el comando dos veces no duplica registros.

Cargan roles, ciudades, medicamentos, usuarios, almacenes, clínicas, inventario y algunas solicitudes de ejemplo. Se crean dos usuarios de prueba:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| admin | admin@medicare.com | Admin123 |
| manager | laura@medicare.com | Manager123 |

> Estas credenciales son para evaluar el proyecto. Elimínalas antes de cualquier despliegue real.

## Autenticación y roles

Todos los endpoints salvo los dos de `/api/auth` exigen un token en la cabecera `Authorization: Bearer <token>`. Los tokens duran 8 horas.

Hay dos roles:

- **manager** — consulta todos los catálogos y gestiona las solicitudes de abastecimiento. Es el usuario operativo del día a día.
- **admin** — todo lo del manager, más crear, actualizar y desactivar medicamentos, almacenes y clínicas, y eliminar solicitudes.

`POST /api/auth/register` es público y **siempre crea un manager**. El rol no se acepta desde el cuerpo de la petición: dejar que el cliente lo eligiera significaría que cualquiera puede registrarse como administrador. Las cuentas de admin salen de los seeders o directamente de la base de datos.

## Documentación de la API

Con el servidor corriendo, la interfaz interactiva de Swagger está en:

```
http://localhost:3000/api/docs
```

Llama a `POST /api/auth/login`, copia el token que devuelve y pégalo en el botón **Authorize**. Pega solo el token, sin la palabra `Bearer`.

## Endpoints

23 endpoints: 2 públicos, 21 que exigen token y 11 de esos restringidos a `admin`.

### Auth

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Público | Registra un usuario. Siempre se crea como `manager` |
| POST | `/api/auth/login` | Público | Valida las credenciales y devuelve un JWT |

### Medicamentos

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/medications` | Autenticado | Lista los medicamentos activos |
| GET | `/api/medications/:id` | Autenticado | Consulta un medicamento |
| POST | `/api/medications` | admin | Crea un medicamento |
| PUT | `/api/medications/:id` | admin | Actualiza un medicamento |
| DELETE | `/api/medications/:id` | admin | Desactiva un medicamento |

### Almacenes

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/warehouses` | Autenticado | Lista los almacenes activos con su ciudad |
| GET | `/api/warehouses/:id` | Autenticado | Consulta un almacén |
| POST | `/api/warehouses` | admin | Registra un almacén |
| PUT | `/api/warehouses/:id` | admin | Actualiza un almacén |
| DELETE | `/api/warehouses/:id` | admin | Desactiva un almacén |

### Clínicas

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/clinics` | Autenticado | Lista las clínicas activas con ciudad y responsable |
| GET | `/api/clinics/:id` | Autenticado | Consulta una clínica |
| POST | `/api/clinics` | admin | Registra una clínica |
| PUT | `/api/clinics/:id` | admin | Actualiza una clínica |
| DELETE | `/api/clinics/:id` | admin | Desactiva una clínica |

### Solicitudes

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/requests` | Autenticado | Lista las solicitudes activas, más recientes primero |
| GET | `/api/requests/:id` | Autenticado | Consulta una solicitud |
| GET | `/api/requests/clinic/:clinicId` | Autenticado | Historial completo de solicitudes de una clínica |
| POST | `/api/requests` | admin, manager | Crea una solicitud y descuenta el stock |
| PATCH | `/api/requests/:id/status` | admin, manager | Cambia el estado |
| DELETE | `/api/requests/:id` | admin | Elimina una solicitud y devuelve el stock |

## Reglas de negocio

**Estados de una solicitud.** Nace como `pendiente` y pasa a `aprobada`, `rechazada` o `entregada`. Los estados `rechazada` y `entregada` son finales: cualquier cambio posterior se rechaza con un 400. Esa guarda es lo que impide devolver el mismo stock dos veces.

**Inventario.** Crear una solicitud descuenta la cantidad pedida del inventario del almacén. Rechazarla, o eliminarla mientras sigue en curso, la devuelve. Ambas operaciones corren dentro de una transacción, así que la escritura en el inventario y la de la solicitud se confirman las dos o no se confirma ninguna.

**Una solicitud se rechaza cuando** la clínica, el medicamento o el almacén no existen o están inactivos, cuando el almacén no maneja ese medicamento, o cuando la cantidad disponible es menor que la solicitada. El mensaje de error indica cuánto hay disponible y cuánto se pidió.

**El usuario solicitante** se toma siempre del token, nunca del cuerpo de la petición, para que nadie pueda registrar solicitudes a nombre de otro.

**Nada se borra físicamente.** Todas las tablas tienen un campo `is_active` y las operaciones de borrado solo lo cambian, lo que mantiene intacto el historial de solicitudes.

## Códigos de respuesta

| Código | Cuándo |
| --- | --- |
| 200 | Consulta o actualización correcta |
| 201 | Recurso creado |
| 400 | El cuerpo no pasa la validación de Zod, o se incumple una regla de negocio |
| 401 | Token ausente, mal formado o expirado, o credenciales incorrectas |
| 403 | Token válido, pero el rol no puede hacer esa operación |
| 404 | El recurso solicitado no existe o está inactivo |
| 500 | Error inesperado del servidor |

## Estructura del proyecto

```
src/
├── config/          Conexión a la base, spec de Swagger y ejecutor de seeders
├── models/          Los ocho modelos de Sequelize y sus asociaciones
├── dto/             Esquemas de Zod para los cuerpos de las peticiones
├── middlewares/     verifyToken, checkRole y validateRequest
├── services/        Lógica de negocio y transacciones
├── controllers/     Traducen entre HTTP y los servicios
├── routes/          Endpoints y sus anotaciones de OpenAPI
├── seeders/         Datos iniciales, numerados por orden de dependencia
├── app.ts           Construye la aplicación de Express
└── server.ts        Punto de entrada: conecta, sincroniza y escucha
```

Cada capa solo habla con la inmediatamente inferior. Los servicios nunca mencionan `req` ni `res`, lo que mantiene la lógica de negocio independiente de HTTP.

## Repositorio

https://github.com/Nesdael/prueba-desempeno_nodejs
