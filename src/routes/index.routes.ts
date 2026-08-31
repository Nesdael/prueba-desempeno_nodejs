import { Router } from "express";
import authRoutes from "./auth.routes.js";
import medicationsRoutes from "./medications.routes.js";
import warehousesRoutes from "./warehouses.routes.js";
import clinicsRoutes from "./clinics.routes.js";
import requestsRoutes from "./requests.routes.js";

const router = Router();

// todo cuelga de /api (ver app.ts)
router.use("/auth", authRoutes);
router.use("/medications", medicationsRoutes);
router.use("/warehouses", warehousesRoutes);
router.use("/clinics", clinicsRoutes);
router.use("/requests", requestsRoutes);


export default router;
