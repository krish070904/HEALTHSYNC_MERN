// /src/routes/alertRoutes.js
import express from "express";
import { createAlertManual, getUserAlerts, updateAlertStatus } from "../controllers/alertController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/alerts → fetch user alerts
router.get("/", authMiddleware, getUserAlerts);

// POST /api/alerts → manual/admin creation
router.post("/", authMiddleware, createAlertManual);

// PUT /api/alerts/:id/status → update status
router.put("/:id/status", authMiddleware, updateAlertStatus);

export default router;
