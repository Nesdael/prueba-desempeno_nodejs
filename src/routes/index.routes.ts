import { Router } from "express";
import authRoutes from "./auth.routes.js";
import medicationsRoutes from "./medications.routes.js";
import warehousesRoutes from "./warehouses.routes.js";
import clinicsRoutes from "./clinics.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/medications", medicationsRoutes);
router.use("/warehouses", warehousesRoutes);
router.use("/clinics", clinicsRoutes);


export default router;
