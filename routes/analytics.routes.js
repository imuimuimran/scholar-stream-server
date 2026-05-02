import express from "express";
import {
  getDashboardStats,
  getApplicationsByCategory,
  getApplicationsByUniversity,
  getApplicationStatusStats,
  getRevenueOverTime,
} from "../controllers/analytics.controller.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/summary", verifyJWT, verifyAdmin, getDashboardStats);
router.get("/category", verifyJWT, verifyAdmin, getApplicationsByCategory);
router.get("/university", verifyJWT, verifyAdmin, getApplicationsByUniversity);
router.get("/status", verifyJWT, verifyAdmin, getApplicationStatusStats);
router.get("/revenue", verifyJWT, verifyAdmin, getRevenueOverTime);

export default router;