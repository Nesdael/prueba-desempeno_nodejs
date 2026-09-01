# RiwiMediCare Plus API

REST API to manage medication supply requests between clinics and warehouses: clinic and warehouse registration, medication inventory, supply requests and their status, all protected with JWT authentication and role-based access.

## Coder

- **Name:** Nestor Daniel Duran Fuentes
- **Clan:** Centurion

## Tech stack

- Node.js (18+)
- Express
- TypeScript
- Sequelize (ORM)
- PostgreSQL
- JSON Web Token (JWT)
- Zod (request validation)
- bcrypt (password hashing)
- Umzug (seeders runner)
- Swagger (swagger-jsdoc + swagger-ui-express)
- Docker / Docker Compose

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Nesdael/prueba-desempeno_nodejs.git
   cd prueba-desempeno_nodejs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Make sure a PostgreSQL database is running and matches the values in your `.env` (either a local instance or via `docker compose up db`).

There are no manual migration steps: the database schema is created and kept in sync automatically from the Sequelize models the first time the server starts.

## Environment variables

Copy `.env.example` to `.env` and adjust the values to your environment:

```
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=admin123
DATABASE_NAME=db_nodejs

JWT_SECRET=una_clave_secreta_larga_y_dificil_de_adivinar
```

## Running the project

### Local development

```bash
npm run dev
```

Starts the API with hot reload at `http://localhost:PORT` and creates/updates the database schema automatically.

### Production build

```bash
npm run build
npm start
```

`npm run build` compiles TypeScript into `dist/`, and `npm start` runs the compiled server with plain Node.

### With Docker

```bash
docker compose up -d
```

This starts two containers: the API and PostgreSQL, connected on the same internal network, with a volume for database persistence.

## Running the seeders

Seeders load base data (roles, cities, medications, users, warehouses, clinics and inventory) needed to test the API. They live in `src/seeders/` and run in order with [Umzug](https://github.com/sequelize/umzug):

```bash
npm run seed
```

To revert the last applied seeder:

```bash
npm run seed:down
```

After seeding, you can log in with the sample users created by `004-users.seed.ts`:

| Role    | Email                 | Password    |
| ------- | ---------------------- | ----------- |
| admin   | admin@medicare.com     | Admin123    |
| manager | laura@medicare.com     | Manager123  |

## API documentation

Once the server is running, the interactive Swagger UI is available at:

```
http://localhost:PORT/api/docs
```

Log in through `POST /api/auth/login`, copy the returned token and paste it into the **Authorize** button (token only, without the word `Bearer`) to try out protected endpoints.

## Repository

https://github.com/Nesdael/prueba-desempeno_nodejs
