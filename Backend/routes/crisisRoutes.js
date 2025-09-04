import express from "express";
import { createCrisisAlert, listCrisisAlerts, updateCrisisStatus } from "../controllers/crisisController.js";

const router = express.Router();

router.post("/", createCrisisAlert);
router.get("/", listCrisisAlerts);
router.patch("/:id/status", updateCrisisStatus);

export default router;


