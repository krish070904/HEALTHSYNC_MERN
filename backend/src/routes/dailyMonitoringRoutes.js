import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createDailyMonitoring } from "../controllers/dailyMonitoringController.js";

const router = express.Router();

router.post("/create", authMiddleware, createDailyMonitoring);

export default router;
